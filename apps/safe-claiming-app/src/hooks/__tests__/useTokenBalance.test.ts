import { waitFor } from "@testing-library/react"
import { renderHook } from "@testing-library/react-hooks"
import { BigNumber, ethers } from "ethers"
import { useTokenBalance } from "src/hooks/useTokenBalance"
import { SafeToken__factory } from "src/types/contracts/factories/SafeToken__factory"
import { getWeb3Provider } from "src/utils/getWeb3Provider"

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
        chainId: 5,
      },
      sdk: undefined,
    }),
  }
})

jest.mock("src/utils/getWeb3Provider", () => ({
  getWeb3Provider: () => mockWeb3Provider,
}))

describe("useTokenBalance", () => {
  const web3Provider = getWeb3Provider(undefined as never, undefined as never)
  const mockCall = jest.fn()
  web3Provider.call = mockCall

  afterAll(() => {
    jest.unmock("src/utils/getWeb3Provider")
    jest.unmock("@gnosis.pm/safe-apps-react-sdk")
  })

  it("should return 0 initially", () => {
    mockCall.mockImplementation(() => Promise.resolve)
    const { result } = renderHook(() => useTokenBalance())
    expect(result.current).toEqual(ethers.utils.parseEther("0"))
    expect(mockCall).toBeCalledTimes(0)
  })

  it("should return 0 on error", async () => {
    mockCall.mockImplementation(() => Promise.reject("ERROR"))
    const { result } = renderHook(() => useTokenBalance())
    await waitFor(() => {
      expect(result.current).toEqual(ethers.utils.parseEther("0"))
      expect(mockCall).toBeCalledTimes(1)
    })
  })

  it("should return 20.000 tokens", async () => {
    mockCall.mockImplementation(async () =>
      Promise.resolve(
        SafeToken__factory.createInterface().encodeFunctionResult("balanceOf", [
          BigNumber.from("20000"),
        ])
      )
    )
    const { result } = renderHook(() => useTokenBalance())
    await waitFor(() => {
      expect(result.current).toEqual(BigNumber.from("20000"))
      expect(mockCall).toBeCalledTimes(1)
    })
  })
})
