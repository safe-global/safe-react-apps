import { act, waitFor } from "@testing-library/react"
import { renderHook } from "@testing-library/react-hooks"
import { ethers } from "ethers"
import { hexZeroPad } from "ethers/lib/utils"
import { USER_AIRDROP_ADDRESS, ZERO_ADDRESS } from "src/config/constants"
import { Airdrop__factory } from "src/types/contracts/factories/Airdrop__factory"
import { getWeb3Provider } from "src/utils/getWeb3Provider"
import { useFetchVestingStatus } from "../useFetchVestingStatus"

const SAFE_ADDRESS = "0x6a13e0280740cc5bd35eeee33b470b5bbb93df37"

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
        safeAddress: "0x6a13E0280740CC5bd35eeee33B470b5bBb93dF37",
        chainId: "4",
      },
      sdk: undefined,
    }),
  }
})

jest.mock("src/utils/getWeb3Provider", () => ({
  getWeb3Provider: () => mockWeb3Provider,
}))

describe("useFetchVestingStatus", () => {
  const web3Provider = getWeb3Provider(undefined as never, undefined as never)

  afterAll(() => {
    jest.unmock("src/utils/getWeb3Provider")
    jest.unmock("@gnosis.pm/safe-apps-react-sdk")
  })

  it("returns undefined for undefined vestingId", () => {
    const { result } = renderHook(() =>
      useFetchVestingStatus(undefined, USER_AIRDROP_ADDRESS, 1)
    )

    expect(result.current).toBeUndefined()
  })

  it("returns undefined for unexpected errors", async () => {
    // No return value for call causes an error
    const mockCall = jest.fn()
    web3Provider.call = mockCall
    const { result } = renderHook(() =>
      useFetchVestingStatus(hexZeroPad("0x1234", 32), USER_AIRDROP_ADDRESS, 1)
    )
    await waitFor(() => {
      expect(result.current).toBeUndefined()
      expect(mockCall).toBeCalledTimes(1)
    })
  })

  it("vesting gets redeemed between two fetch updates triggered by the timestamp", async () => {
    const testVestingId =
      "0xd2b4c773ce0596c5bb3d5f5e65fa7c0c1a2421a6c0d41034caf4f0a7640b9b8b"
    const mockCall = jest.fn()
    mockCall.mockImplementationOnce((tx) => {
      expect(tx.data?.toString().toLowerCase()).toContain(
        testVestingId.slice(2).toLowerCase()
      )
      const airdropInterface = Airdrop__factory.createInterface()
      const returnValue = airdropInterface.encodeFunctionResult("vestings", [
        ZERO_ADDRESS,
        0,
        false,
        0,
        0,
        "0",
        "0",
        "0",
        false,
      ])
      return Promise.resolve(returnValue)
    })
    mockCall.mockImplementationOnce((tx) => {
      expect(tx.data?.toString().toLowerCase()).toContain(
        testVestingId.slice(2).toLowerCase()
      )
      const airdropInterface = Airdrop__factory.createInterface()
      const returnValue = airdropInterface.encodeFunctionResult("vestings", [
        SAFE_ADDRESS,
        0,
        false,
        2,
        100,
        "1000",
        "0",
        "0",
        false,
      ])
      return Promise.resolve(returnValue)
    })
    web3Provider.call = mockCall

    const { result, rerender } = renderHook(
      ({ lastClaimTimestamp }) =>
        useFetchVestingStatus(
          testVestingId,
          USER_AIRDROP_ADDRESS,
          lastClaimTimestamp
        ),
      { initialProps: { lastClaimTimestamp: 1 } }
    )

    await waitFor(() => {
      expect(result.current).not.toBeNull()
      const resultingClaim = result.current
      expect(resultingClaim?.amountClaimed).toEqual("0")
      expect(resultingClaim?.isRedeemed).toBeFalsy()
      expect(mockCall).toBeCalledTimes(1)
    })

    // Same timestamp should not trigger a new on-chain fetch
    act(() => rerender({ lastClaimTimestamp: 1 }))

    expect(mockCall).toBeCalledTimes(1)

    // New timestamp should trigger update and new fetch
    act(() => rerender({ lastClaimTimestamp: 2 }))

    await waitFor(() => {
      expect(result.current).not.toBeNull()
      const resultingClaim = result.current
      expect(resultingClaim?.amountClaimed).toEqual("0")
      expect(resultingClaim?.isRedeemed).toBeTruthy()
      expect(mockCall).toBeCalledTimes(2)
    })
  })
})
