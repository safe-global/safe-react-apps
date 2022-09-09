import { waitFor } from "@testing-library/react"
import { renderHook } from "@testing-library/react-hooks"
import { ethers } from "ethers"
import {
  DelegateIDs,
  DelegateRegistryAddress,
  ZERO_ADDRESS,
} from "src/config/constants"
import { getWeb3Provider } from "src/utils/getWeb3Provider"
import { useDelegate } from "../useDelegate"

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
        chainId: 4,
      },
      sdk: undefined,
    }),
  }
})

jest.mock("src/utils/getWeb3Provider", () => ({
  getWeb3Provider: () => mockWeb3Provider,
}))

describe("useDelegate()", () => {
  const web3Provider = getWeb3Provider(undefined as never, undefined as never)

  afterAll(() => {
    jest.unmock("src/utils/getWeb3Provider")
    jest.unmock("@gnosis.pm/safe-apps-react-sdk")
  })

  it("ignore the ZERO_ADDRESS as delegate", async () => {
    const delegateIDInBytes = ethers.utils.formatBytes32String(DelegateIDs[4])

    web3Provider.call = jest.fn((transaction) => {
      expect(transaction.to?.toString().toLowerCase()).toEqual(
        DelegateRegistryAddress.toLowerCase()
      )
      expect(transaction.data?.toString().toLowerCase()).toContain(
        SAFE_ADDRESS.toLowerCase().slice(2)
      )
      expect(transaction.data?.toString().toLowerCase()).toContain(
        delegateIDInBytes.toLowerCase().slice(2)
      )
      return Promise.resolve(ethers.utils.hexZeroPad(ZERO_ADDRESS, 32))
    })

    const result = renderHook(() => useDelegate())

    expect(result.result.current).toBeUndefined()

    await waitFor(() => {
      expect(mockWeb3Provider.call).toBeCalledTimes(1)
    })

    expect(result.result.current).toBeUndefined()
  })

  it("should encode the correct data and fetch the delegate on-chain once", async () => {
    const delegateIDInBytes = ethers.utils.formatBytes32String(DelegateIDs[4])
    const delegateAddress = ethers.utils.hexZeroPad("0x1", 20)

    web3Provider.call = jest.fn((transaction) => {
      expect(transaction.to?.toString().toLowerCase()).toEqual(
        DelegateRegistryAddress.toLowerCase()
      )
      expect(transaction.data?.toString().toLowerCase()).toContain(
        SAFE_ADDRESS.toLowerCase().slice(2)
      )
      expect(transaction.data?.toString().toLowerCase()).toContain(
        delegateIDInBytes.toLowerCase().slice(2)
      )
      return Promise.resolve(ethers.utils.hexZeroPad(delegateAddress, 32))
    })

    const result = renderHook(() => useDelegate())

    expect(result.result.current).toBeUndefined()

    await waitFor(() => {
      expect(result.result.current).not.toBeUndefined()
    })

    expect(result.result.current).toEqual(delegateAddress)
    expect(mockWeb3Provider.call).toBeCalledTimes(1)
  })
})
