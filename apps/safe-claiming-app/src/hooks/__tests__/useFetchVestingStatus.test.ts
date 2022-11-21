import { waitFor } from "@testing-library/react"
import { renderHook } from "@testing-library/react-hooks"
import { hexZeroPad } from "ethers/lib/utils"
import { getWeb3Provider } from "src/utils/getWeb3Provider"
import { useFetchVestingStatus } from "../useFetchVestingStatus"

const contractAddress = "0x07dA2049Fa8127eF6280631BCbc56881d764C8Ee"

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
      useFetchVestingStatus(undefined, contractAddress)
    )

    expect(result.current[0]).toBeUndefined()
  })

  it("returns undefined for unexpected errors", async () => {
    // No return value for call causes an error
    const mockCall = jest.fn()
    web3Provider.call = mockCall
    const { result } = renderHook(() =>
      useFetchVestingStatus(hexZeroPad("0x1234", 32), contractAddress)
    )
    await waitFor(() => {
      expect(result.current[0]).toBeUndefined()
      expect(result.current[2]).toBeDefined()
      expect(mockCall).toBeCalledTimes(1)
    })
  })
})
