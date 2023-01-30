import { waitFor } from "@testing-library/react"
import { renderHook } from "@testing-library/react-hooks"
import { SafeToken__factory } from "src/types/contracts/factories/SafeToken__factory"
import { getWeb3Provider } from "src/utils/getWeb3Provider"
import { useIsTokenPaused } from "../useIsTokenPaused"

const mockWeb3Provider = {
  _isProvider: true,
  call: jest.fn(() => Promise.reject("call")),
}
jest.mock("@safe-global/safe-apps-react-sdk", () => {
  const originalModule = jest.requireActual("@safe-global/safe-apps-react-sdk")
  return {
    __esModule: true,
    // We require some of the enums/types from the original module
    ...originalModule,
    useSafeAppsSDK: () => ({
      safe: {
        safeAddress: "0x6a13E0280740CC5bd35eeee33B470b5bBb93dF37",
        chainId: 4,
      },
      sdk: undefined,
    }),
  }
})

jest.mock("src/utils/getWeb3Provider", () => ({
  getWeb3Provider: () => mockWeb3Provider,
}))

describe("useIsTokenPaused", () => {
  const web3Provider = getWeb3Provider(undefined as never, undefined as never)
  const mockCall = jest.fn()
  web3Provider.call = mockCall

  afterAll(() => {
    jest.unmock("src/utils/getWeb3Provider")
    jest.unmock("@safe-global/safe-apps-react-sdk")
  })

  it("should return true initially", () => {
    mockCall.mockImplementation(() => Promise.resolve)
    const { result } = renderHook(() => useIsTokenPaused())
    expect(result.current).toBeTruthy()
    expect(mockCall).toBeCalledTimes(0)
  })

  it("should return true on error", async () => {
    mockCall.mockImplementation(() => Promise.reject("ERROR"))
    const { result } = renderHook(() => useIsTokenPaused())
    await waitFor(() => {
      expect(result.current).toBeTruthy()
      expect(mockCall).toBeCalledTimes(1)
    })
  })

  it("should return true if token is paused", async () => {
    mockCall.mockImplementation(async () =>
      Promise.resolve(
        SafeToken__factory.createInterface().encodeFunctionResult("paused", [
          true,
        ])
      )
    )
    const { result } = renderHook(() => useIsTokenPaused())
    await waitFor(() => {
      expect(result.current).toBeTruthy()
      expect(mockCall).toBeCalledTimes(1)
    })
  })

  it("should return false if token is unpaused", async () => {
    mockCall.mockImplementation(async () =>
      Promise.resolve(
        SafeToken__factory.createInterface().encodeFunctionResult("paused", [
          false,
        ])
      )
    )
    const { result } = renderHook(() => useIsTokenPaused())

    await waitFor(() => {
      expect(result.current).toBeFalsy()
      expect(mockCall).toBeCalledTimes(1)
    })
  })
})
