import { renderHook, act } from "@testing-library/react-hooks"
import { waitFor } from "@testing-library/react"
import { useEnsResolution } from "src/hooks/useEnsResolution"
import { getWeb3Provider } from "src/utils/getWeb3Provider"

const mockWeb3Provider = {
  resolveName: jest.fn(() => Promise.reject("resolveName")),
}

jest.mock("@gnosis.pm/safe-apps-react-sdk", () => {
  const originalModule = jest.requireActual("@gnosis.pm/safe-apps-react-sdk")
  return {
    __esModule: true,
    // We require some of the enums/types from the original module
    ...originalModule,
    useSafeAppsSDK: () => ({
      safe: {
        chainId: 1,
        safeAddress: "0x2000000000000000000000000000000000000000",
      },
      sdk: undefined,
    }),
  }
})

jest.mock("src/utils/getWeb3Provider", () => ({
  getWeb3Provider: () => mockWeb3Provider,
}))

describe("useEnsResolution()", () => {
  const web3Provider = getWeb3Provider(undefined as never, undefined as never)

  afterAll(() => {
    jest.unmock("src/utils/getWeb3Provider")
    jest.unmock("@gnosis.pm/safe-apps-react-sdk")
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it("should return valid addresses immediately and not trigger ens resolution", async () => {
    const validAddress = "0x1000000000000000000000000000000000000000"
    web3Provider.resolveName = jest.fn()
    jest.useFakeTimers()
    const { result } = renderHook(() => useEnsResolution(validAddress))

    expect(result.current[0]).toEqual({ address: validAddress })
    expect(result.current[1]).toBeUndefined()
    expect(result.current[2]).toBeFalsy()
    expect(web3Provider.resolveName).not.toHaveBeenCalled()

    jest.advanceTimersByTime(301)
    expect(web3Provider.resolveName).not.toHaveBeenCalled()
  })

  it("should accept EIP 3770 addresses with correct chain prefix", async () => {
    const validAddress = "eth:0x1000000000000000000000000000000000000000"
    web3Provider.resolveName = jest.fn()
    jest.useFakeTimers()
    const { result } = renderHook(() => useEnsResolution(validAddress))

    expect(result.current[0]).toEqual({ address: validAddress.slice(4) })
    expect(result.current[1]).toBeUndefined()
    expect(result.current[2]).toBeFalsy()
    expect(web3Provider.resolveName).not.toHaveBeenCalled()

    jest.advanceTimersByTime(301)
    expect(web3Provider.resolveName).not.toHaveBeenCalled()
  })

  it("should not accept EIP 3770 addresses with wrong chain prefix", async () => {
    const validAddress = "rin:0x1000000000000000000000000000000000000000"
    web3Provider.resolveName = jest.fn()
    jest.useFakeTimers()
    const { result } = renderHook(() => useEnsResolution(validAddress))

    expect(result.current[0]).toBeUndefined()
    expect(result.current[1]).toEqual("The chain prefix needs to be eth:")
    expect(web3Provider.resolveName).not.toHaveBeenCalled()

    jest.advanceTimersByTime(301)
    expect(web3Provider.resolveName).not.toHaveBeenCalled()
  })

  it("should checksum manual addresses and not trigger ens resolution", async () => {
    const checksummedAddress = "0x571a651965976752BaF5832B545794dD50e766ba"
    web3Provider.resolveName = jest.fn()
    jest.useFakeTimers()
    const { result } = renderHook(() =>
      useEnsResolution(checksummedAddress.toLowerCase())
    )

    expect(result.current[0]).toEqual({ address: checksummedAddress })
    expect(result.current[1]).toBeUndefined()
    expect(result.current[2]).toBeFalsy()
    expect(web3Provider.resolveName).not.toHaveBeenCalled()

    jest.advanceTimersByTime(301)
    expect(web3Provider.resolveName).not.toHaveBeenCalled()
  })

  it("should return immediately for empty strings and not trigger ens resolution", async () => {
    web3Provider.resolveName = jest.fn()
    jest.useFakeTimers()
    const { result } = renderHook(() => useEnsResolution(""))

    expect(result.current[0]).toBeUndefined()
    expect(result.current[1]).toBeUndefined()
    expect(result.current[2]).toBeFalsy()
    expect(web3Provider.resolveName).not.toHaveBeenCalled()

    jest.advanceTimersByTime(301)
    expect(web3Provider.resolveName).not.toHaveBeenCalled()
  })

  it("should set error for unexpected errors during ENS resolution", async () => {
    web3Provider.resolveName = jest.fn(() =>
      Promise.reject("Unexpected errors.")
    )
    jest.useFakeTimers()
    const { result } = renderHook(() => useEnsResolution("test.eth"))

    expect(result.current[0]).toBeUndefined()
    expect(result.current[1]).toBeUndefined()
    expect(result.current[2]).toBeFalsy()
    expect(web3Provider.resolveName).not.toHaveBeenCalled()

    act(() => {
      jest.advanceTimersByTime(301)
    })

    await waitFor(() => {
      expect(result.current[2]).toBeFalsy()
    })

    expect(web3Provider.resolveName).toHaveBeenCalled()
    expect(result.current[0]).toBeUndefined()
    expect(result.current[1]).toEqual("Error while resolving ENS")
    expect(result.current[2]).toBeFalsy()
  })

  it("should resolve ENS names after 300ms", async () => {
    const resolvedAddress = "0x1000000000000000000000000000000000000000"
    web3Provider.resolveName = jest.fn(() => Promise.resolve(resolvedAddress))

    jest.useFakeTimers()
    const { result } = renderHook(() => useEnsResolution("test.eth"))

    expect(result.current[0]).toBeUndefined()
    expect(result.current[1]).toBeUndefined()
    expect(result.current[2]).toBeFalsy()
    expect(web3Provider.resolveName).not.toHaveBeenCalled()

    jest.advanceTimersByTime(299)

    expect(result.current[0]).toBeUndefined()
    expect(result.current[1]).toBeUndefined()
    expect(result.current[2]).toBeFalsy()
    expect(web3Provider.resolveName).not.toHaveBeenCalled()

    // this should trigger the timer
    act(() => {
      jest.advanceTimersByTime(2)
    })
    expect(result.current[2]).toBeTruthy()
    // wait to resolve the promise
    await waitFor(() => {
      expect(result.current[2]).toBeFalsy()
    })
    expect(web3Provider.resolveName).toHaveBeenCalledTimes(1)
    expect(result.current[0]).not.toBeUndefined()
    expect(result.current[1]).toBeUndefined()
    expect(result.current[2]).toBeFalsy()
  })

  it("should debounce ENS resolution", async () => {
    const resolvedAddress = "0x1000000000000000000000000000000000000000"
    web3Provider.resolveName = jest.fn(() => Promise.resolve(resolvedAddress))

    jest.useFakeTimers()

    const { result, rerender } = renderHook(
      ({ ensName }) => useEnsResolution(ensName),
      { initialProps: { ensName: "test.eth" } }
    )

    expect(result.current[0]).toBeUndefined()
    expect(result.current[1]).toBeUndefined()
    expect(result.current[2]).toBeFalsy()
    expect(web3Provider.resolveName).not.toHaveBeenCalled()

    jest.advanceTimersByTime(299)

    expect(result.current[0]).toBeUndefined()
    expect(result.current[1]).toBeUndefined()
    expect(result.current[2]).toBeFalsy()
    expect(web3Provider.resolveName).not.toHaveBeenCalled()

    rerender({ ensName: "test2.eth" })

    act(() => {
      jest.advanceTimersByTime(299)
    })

    expect(result.current[0]).toBeUndefined()
    expect(result.current[1]).toBeUndefined()
    expect(result.current[2]).toBeFalsy()
    expect(web3Provider.resolveName).not.toHaveBeenCalled()

    // this should trigger the resolution
    act(() => {
      jest.advanceTimersByTime(2)
    })
    expect(result.current[2]).toBeTruthy()
    // wait to resolve the promise
    await waitFor(() => {
      expect(result.current[2]).toBeFalsy()
    })
    expect(web3Provider.resolveName).toHaveBeenCalledTimes(1)
    expect(result.current[0]).toEqual({
      address: resolvedAddress,
      ens: "test2.eth",
    })
    expect(result.current[1]).toBeUndefined()
    expect(result.current[2]).toBeFalsy()
  })

  it("should trigger ens resolution multiple times when slowly typing", async () => {
    const resolvedAddress = "0x1000000000000000000000000000000000000000"
    web3Provider.resolveName = jest
      .fn()
      .mockImplementationOnce(() => Promise.resolve(null))
      .mockImplementationOnce(() => Promise.resolve(null))
      .mockImplementationOnce(() => Promise.resolve(resolvedAddress))

    jest.useFakeTimers()

    const { result, rerender } = renderHook(
      ({ ensName }) => useEnsResolution(ensName),
      { initialProps: { ensName: "t" } }
    )
    act(() => {
      jest.advanceTimersByTime(310)
    })
    await waitFor(() => {
      expect(result.current[2]).toBeFalsy()
    })

    expect(web3Provider.resolveName).toHaveBeenCalledTimes(1)
    expect(result.current[0]).toBeUndefined()
    expect(result.current[1]).toEqual("Invalid address / ENS name")
    expect(result.current[2]).toBeFalsy()

    rerender({ ensName: "te" })

    act(() => {
      jest.advanceTimersByTime(120)
    })

    rerender({ ensName: "tes" })

    act(() => {
      jest.advanceTimersByTime(120)
    })

    rerender({ ensName: "test" })

    act(() => {
      jest.advanceTimersByTime(320)
    })

    await waitFor(() => {
      expect(result.current[2]).toBeFalsy()
    })

    expect(result.current[0]).toBeUndefined()
    expect(result.current[1]).toEqual("Invalid address / ENS name")
    expect(result.current[2]).toBeFalsy()

    rerender({ ensName: "test." })

    act(() => {
      jest.advanceTimersByTime(120)
    })

    rerender({ ensName: "test.e" })

    act(() => {
      jest.advanceTimersByTime(120)
    })

    rerender({ ensName: "test.et" })

    act(() => {
      jest.advanceTimersByTime(120)
    })

    rerender({ ensName: "test.eth" })

    act(() => {
      jest.advanceTimersByTime(310)
    })

    await waitFor(() => {
      expect(result.current[2]).toBeFalsy()
    })

    expect(web3Provider.resolveName).toHaveBeenCalledTimes(3)

    expect(result.current[0]).toEqual({
      address: resolvedAddress,
      ens: "test.eth",
    })
    expect(result.current[1]).toBeUndefined()
    expect(result.current[2]).toBeFalsy()
  })

  it("should set error if resolved address is the same as the current safe address", async () => {
    const resolvedAddress = "0x2000000000000000000000000000000000000000"
    web3Provider.resolveName = jest.fn(() => Promise.resolve(resolvedAddress))
    jest.useFakeTimers()
    const { result } = renderHook(() => useEnsResolution("test.eth"))

    expect(result.current[0]).toBeUndefined()
    expect(result.current[1]).toBeUndefined()
    expect(result.current[2]).toBeFalsy()
    expect(web3Provider.resolveName).not.toHaveBeenCalled()

    act(() => {
      jest.advanceTimersByTime(301)
    })

    await waitFor(() => {
      expect(result.current[2]).toBeFalsy()
    })

    expect(web3Provider.resolveName).toHaveBeenCalled()
    expect(result.current[0]).toBeUndefined()
    expect(result.current[1]).toEqual("You can't delegate to your own Safe")
    expect(result.current[2]).toBeFalsy()
  })

  it("should set error if typed address is the same as the current safe address", async () => {
    const resolvedAddress = "0x2000000000000000000000000000000000000000"
    jest.useFakeTimers()
    const { result } = renderHook(() => useEnsResolution(resolvedAddress))

    expect(result.current[1]).toEqual("You can't delegate to your own Safe")
    expect(result.current[2]).toBeFalsy()
  })
})
