import { waitFor } from "@testing-library/react"
import { renderHook } from "@testing-library/react-hooks"
import {
  defaultAbiCoder,
  hexZeroPad,
  keccak256,
  parseEther,
  toUtf8Bytes,
} from "ethers/lib/utils"
import useSafeTokenAllocation from "../useSafeTokenAllocation"
import { BigNumber } from "ethers"
import { getWeb3Provider } from "src/utils/getWeb3Provider"
import { ZERO_ADDRESS } from "src/config/constants"

const mockWeb3Provider = {
  _isProvider: true,
  call: jest.fn(() => Promise.reject("call")),
}
jest.mock("@gnosis.pm/safe-apps-react-sdk", () => {
  const originalModule = jest.requireActual("@gnosis.pm/safe-apps-react-sdk")
  return {
    __esModule: true,
    // We require some of the enums/types from the original module
    ...originalModule,
    useSafeAppsSDK: () => ({
      safe: {
        safeAddress: "0x0000000000000000000000000000000000000002",
        chainId: 5,
      },
      sdk: undefined,
    }),
  }
})

jest.mock("src/utils/getWeb3Provider", () => ({
  getWeb3Provider: () => mockWeb3Provider,
}))

const setupFetchStub =
  (data: any, status: number = 200) =>
  (_url: string) => {
    return Promise.resolve({
      json: () => Promise.resolve(data),
      status,
      ok: status === 200,
    })
  }

describe("useSafeTokenAllocation", () => {
  const web3Provider = getWeb3Provider(undefined as never, undefined as never)
  const mockCall = jest.fn()
  web3Provider.call = mockCall

  afterEach(() => {
    //@ts-ignore
    global.fetch?.mockClear?.()
  })

  afterAll(() => {
    // @ts-ignore
    delete global.fetch
  })

  beforeEach(() => {
    jest.resetAllMocks()
  })

  test("return 0 if no allocations / balances exist", async () => {
    global.fetch = jest.fn().mockImplementation(setupFetchStub("", 404))
    const mockFetch = jest.spyOn(global, "fetch")
    mockCall.mockImplementation((transaction: any, blockTag?: any) => {
      const sigHash = keccak256(toUtf8Bytes("balanceOf(address)")).slice(0, 10)
      if (transaction.data?.startsWith(sigHash)) {
        return Promise.resolve("0x0")
      }
      return Promise.resolve("0x")
    })

    const { result } = renderHook(() => useSafeTokenAllocation())

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled()
      expect(result.current[0].votingPower?.toNumber()).toEqual(0)
      expect(result.current[1]).toBeFalsy()
    })
  })

  test("return balance if no allocation exists", async () => {
    global.fetch = jest.fn().mockImplementation(setupFetchStub("", 404))
    const mockFetch = jest.spyOn(global, "fetch")

    mockCall.mockImplementation((transaction: any, blockTag?: any) => {
      const sigHash = keccak256(toUtf8Bytes("balanceOf(address)")).slice(0, 10)
      if (transaction.data?.startsWith(sigHash)) {
        return Promise.resolve(parseEther("100").toHexString())
      }
      return Promise.resolve("0x")
    })

    const { result } = renderHook(() => useSafeTokenAllocation())

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled()
      expect(result.current[0].votingPower?.eq(parseEther("100"))).toBeTruthy()
      expect(result.current[1]).toBeFalsy()
    })
  })

  test("always return allocation if it is rededeemed", async () => {
    const mockAllocation = [
      {
        tag: "user",
        account: hexZeroPad("0x2", 20),
        chainId: 1,
        contract: hexZeroPad("0xabc", 20),
        vestingId: hexZeroPad("0x4110", 32),
        durationWeeks: 208,
        startDate: 1657231200,
        amount: "2000",
        curve: 0,
        proof: [],
      },
    ]

    global.fetch = jest
      .fn()
      .mockImplementation(setupFetchStub(mockAllocation, 200))
    const mockFetch = jest.spyOn(global, "fetch")

    mockCall.mockImplementation((transaction: any, blockTag?: any) => {
      const balanceOfSigHash = keccak256(
        toUtf8Bytes("balanceOf(address)")
      ).slice(0, 10)
      const vestingsSigHash = keccak256(toUtf8Bytes("vestings(bytes32)")).slice(
        0,
        10
      )

      if (transaction.data?.startsWith(balanceOfSigHash)) {
        return Promise.resolve(parseEther("0").toHexString())
      }
      if (transaction.data?.startsWith(vestingsSigHash)) {
        return Promise.resolve(
          defaultAbiCoder.encode(
            [
              "address",
              "uint8",
              "bool",
              "uint16",
              "uint64",
              "uint128",
              "uint128",
              "uint64",
              "bool",
            ],
            [
              hexZeroPad("0x2", 20),
              "0x1",
              false,
              208,
              1657231200,
              2000,
              0,
              0,
              false,
            ]
          )
        )
      }
      return Promise.resolve("0x")
    })

    const { result } = renderHook(() => useSafeTokenAllocation())

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled()
      expect(result.current[0]?.votingPower.toNumber()).toEqual(2000)
      expect(result.current[1]).toBeFalsy()
    })
  })

  test("ignore not redeemed allocations if deadline has passed", async () => {
    const mockAllocation = [
      {
        tag: "user",
        account: hexZeroPad("0x2", 20),
        chainId: 1,
        contract: hexZeroPad("0xabc", 20),
        vestingId: hexZeroPad("0x4110", 32),
        durationWeeks: 208,
        startDate: 1657231200,
        amount: "2000",
        curve: 0,
        proof: [],
      },
    ]

    global.fetch = jest
      .fn()
      .mockImplementation(setupFetchStub(mockAllocation, 200))
    const mockFetch = jest.spyOn(global, "fetch")

    mockCall.mockImplementation((transaction: any, blockTag?: any) => {
      const balanceOfSigHash = keccak256(
        toUtf8Bytes("balanceOf(address)")
      ).slice(0, 10)
      const vestingsSigHash = keccak256(toUtf8Bytes("vestings(bytes32)")).slice(
        0,
        10
      )
      const redeemDeadlineSigHash = keccak256(
        toUtf8Bytes("redeemDeadline()")
      ).slice(0, 10)

      if (transaction.data?.startsWith(balanceOfSigHash)) {
        return Promise.resolve(parseEther("0").toHexString())
      }
      if (transaction.data?.startsWith(vestingsSigHash)) {
        return Promise.resolve(
          defaultAbiCoder.encode(
            [
              "address",
              "uint8",
              "bool",
              "uint16",
              "uint64",
              "uint128",
              "uint128",
              "uint64",
              "bool",
            ],
            [ZERO_ADDRESS, 0, false, 0, 0, 0, 0, 0, false]
          )
        )
      }
      if (transaction.data?.startsWith(redeemDeadlineSigHash)) {
        // 30th Nov 2022
        return Promise.resolve(defaultAbiCoder.encode(["uint64"], [1669766400]))
      }
      return Promise.resolve("0x")
    })

    const { result } = renderHook(() => useSafeTokenAllocation())

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled()
      expect(result.current[0].votingPower.toNumber()).toEqual(0)
      expect(result.current[1]).toBeFalsy()
    })
  })

  test("add not redeemed allocations if deadline has not passed", async () => {
    const mockAllocation = [
      {
        tag: "user",
        account: hexZeroPad("0x2", 20),
        chainId: 1,
        contract: hexZeroPad("0xabc", 20),
        vestingId: hexZeroPad("0x4110", 32),
        durationWeeks: 208,
        startDate: 1657231200,
        amount: "2000",
        curve: 0,
        proof: [],
      },
    ]

    global.fetch = jest
      .fn()
      .mockImplementation(setupFetchStub(mockAllocation, 200))
    const mockFetch = jest.spyOn(global, "fetch")

    mockCall.mockImplementation((transaction: any, blockTag?: any) => {
      const balanceOfSigHash = keccak256(
        toUtf8Bytes("balanceOf(address)")
      ).slice(0, 10)
      const vestingsSigHash = keccak256(toUtf8Bytes("vestings(bytes32)")).slice(
        0,
        10
      )
      const redeemDeadlineSigHash = keccak256(
        toUtf8Bytes("redeemDeadline()")
      ).slice(0, 10)

      if (transaction.data?.startsWith(balanceOfSigHash)) {
        return Promise.resolve(parseEther("0").toHexString())
      }
      if (transaction.data?.startsWith(vestingsSigHash)) {
        return Promise.resolve(
          defaultAbiCoder.encode(
            [
              "address",
              "uint8",
              "bool",
              "uint16",
              "uint64",
              "uint128",
              "uint128",
              "uint64",
              "bool",
            ],
            [ZERO_ADDRESS, 0, false, 0, 0, 0, 0, 0, false]
          )
        )
      }
      if (transaction.data?.startsWith(redeemDeadlineSigHash)) {
        // 08.Dec 2200
        return Promise.resolve(defaultAbiCoder.encode(["uint64"], [7287610110]))
      }
      return Promise.resolve("0x")
    })

    const { result } = renderHook(() => useSafeTokenAllocation())

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled()
      expect(result.current[0].votingPower?.toNumber()).toEqual(2000)
      expect(result.current[1]).toBeFalsy()
    })
  })

  test("test formula: allocation - claimed + balance", async () => {
    const mockAllocation = [
      {
        tag: "user",
        account: hexZeroPad("0x2", 20),
        chainId: 1,
        contract: hexZeroPad("0xabc", 20),
        vestingId: hexZeroPad("0x4110", 32),
        durationWeeks: 208,
        startDate: 1657231200,
        amount: "2000",
        curve: 0,
        proof: [],
      },
    ]

    global.fetch = jest
      .fn()
      .mockImplementation(setupFetchStub(mockAllocation, 200))
    const mockFetch = jest.spyOn(global, "fetch")

    mockCall.mockImplementation((transaction: any, blockTag?: any) => {
      const balanceOfSigHash = keccak256(
        toUtf8Bytes("balanceOf(address)")
      ).slice(0, 10)
      const vestingsSigHash = keccak256(toUtf8Bytes("vestings(bytes32)")).slice(
        0,
        10
      )
      const redeemDeadlineSigHash = keccak256(
        toUtf8Bytes("redeemDeadline()")
      ).slice(0, 10)

      if (transaction.data?.startsWith(balanceOfSigHash)) {
        return Promise.resolve(BigNumber.from("400").toHexString())
      }
      if (transaction.data?.startsWith(vestingsSigHash)) {
        return Promise.resolve(
          defaultAbiCoder.encode(
            [
              "address",
              "uint8",
              "bool",
              "uint16",
              "uint64",
              "uint128",
              "uint128",
              "uint64",
              "bool",
            ],
            // 1000 of 2000 tokens are claimed
            [
              hexZeroPad("0x2", 20),
              "0x1",
              false,
              208,
              1657231200,
              2000,
              1000,
              0,
              false,
            ]
          )
        )
      }
      if (transaction.data?.startsWith(redeemDeadlineSigHash)) {
        // 08.Dec 2200
        return Promise.resolve(defaultAbiCoder.encode(["uint64"], [7287610110]))
      }
      return Promise.resolve("0x")
    })

    const { result } = renderHook(() => useSafeTokenAllocation())

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled()
      expect(result.current[0].votingPower?.toNumber()).toEqual(
        2000 - 1000 + 400
      )
      expect(result.current[1]).toBeFalsy()
    })
  })

  test("test formula: allocation - claimed + balance, everything claimed and no balance", async () => {
    const mockAllocation = [
      {
        tag: "user",
        account: hexZeroPad("0x2", 20),
        chainId: 1,
        contract: hexZeroPad("0xabc", 20),
        vestingId: hexZeroPad("0x4110", 32),
        durationWeeks: 208,
        startDate: 1657231200,
        amount: "2000",
        curve: 0,
        proof: [],
      },
    ]

    global.fetch = jest
      .fn()
      .mockImplementation(setupFetchStub(mockAllocation, 200))
    const mockFetch = jest.spyOn(global, "fetch")

    mockCall.mockImplementation((transaction: any, blockTag?: any) => {
      const balanceOfSigHash = keccak256(
        toUtf8Bytes("balanceOf(address)")
      ).slice(0, 10)
      const vestingsSigHash = keccak256(toUtf8Bytes("vestings(bytes32)")).slice(
        0,
        10
      )
      const redeemDeadlineSigHash = keccak256(
        toUtf8Bytes("redeemDeadline()")
      ).slice(0, 10)

      if (transaction.data?.startsWith(balanceOfSigHash)) {
        return Promise.resolve(BigNumber.from("0").toHexString())
      }
      if (transaction.data?.startsWith(vestingsSigHash)) {
        return Promise.resolve(
          defaultAbiCoder.encode(
            [
              "address",
              "uint8",
              "bool",
              "uint16",
              "uint64",
              "uint128",
              "uint128",
              "uint64",
              "bool",
            ],
            // 1000 of 2000 tokens are claimed
            [
              hexZeroPad("0x2", 20),
              "0x1",
              false,
              208,
              1657231200,
              2000,
              2000,
              0,
              false,
            ]
          )
        )
      }
      if (transaction.data?.startsWith(redeemDeadlineSigHash)) {
        // 08.Dec 2200
        return Promise.resolve(defaultAbiCoder.encode(["uint64"], [7287610110]))
      }
      return Promise.resolve("0x")
    })

    const { result } = renderHook(() => useSafeTokenAllocation())

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled()
      expect(result.current[0].votingPower?.toNumber()).toEqual(0)
      expect(result.current[1]).toBeFalsy()
    })
  })
})
