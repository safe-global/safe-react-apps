import { waitFor } from "@testing-library/react"
import { renderHook } from "@testing-library/react-hooks"
import { hexZeroPad } from "ethers/lib/utils"
import { CHAIN_CONSTANTS } from "src/config/constants"
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
      useFetchVestingStatus(undefined, CHAIN_CONSTANTS[4].USER_AIRDROP_ADDRESS)
    )

    expect(result.current[0]).toBeUndefined()
  })

  it("returns undefined for unexpected errors", async () => {
    // No return value for call causes an error
    const mockCall = jest.fn()
    web3Provider.call = mockCall
    const { result } = renderHook(() =>
      useFetchVestingStatus(
        hexZeroPad("0x1234", 32),
        CHAIN_CONSTANTS[4].USER_AIRDROP_ADDRESS
      )
    )
    await waitFor(() => {
      expect(result.current[0]).toBeUndefined()
      expect(result.current[1]).toBeDefined()
      expect(mockCall).toBeCalledTimes(1)
    })
  })
})
