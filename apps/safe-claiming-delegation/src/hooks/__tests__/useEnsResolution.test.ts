import { act } from '@testing-library/react'
import { waitFor } from '@testing-library/react'
import { JsonRpcProvider } from '@ethersproject/providers'
import * as SafeAppsSdk from '@gnosis.pm/safe-apps-react-sdk'

import { renderHook } from '@/tests/test-utils'
import * as useWeb3 from '@/hooks/useWeb3'
import * as useChains from '@/hooks/useChains'
import { useEnsResolution } from '@/hooks/useEnsResolution'
import type { ChainListResponse } from '@safe-global/safe-gateway-typescript-sdk'
import type { UseQueryResult } from '@tanstack/react-query'

jest.mock('@gnosis.pm/safe-apps-react-sdk', () => {
  return {
    __esModule: true,
    ...jest.requireActual('@gnosis.pm/safe-apps-react-sdk'),
  }
})

jest.mock('@/hooks/useWeb3', () => {
  return {
    __esModule: true,
    ...jest.requireActual('@/hooks/useWeb3'),
  }
})

jest.mock('@/hooks/useChains', () => {
  return {
    __esModule: true,
    ...jest.requireActual('@/hooks/useChains'),
  }
})

describe('useEnsResolution()', () => {
  const web3Provider = new JsonRpcProvider()

  afterEach(() => {
    jest.clearAllMocks()

    jest.useRealTimers()
  })

  it('should return valid addresses immediately and not trigger ENS resolution', async () => {
    const validAddress = '0x1000000000000000000000000000000000000000'

    web3Provider.resolveName = jest.fn()
    jest.spyOn(useWeb3, 'useWeb3').mockImplementation(() => web3Provider)

    jest.useFakeTimers()

    const { result } = renderHook(() => useEnsResolution(validAddress))

    expect(result.current[0]).toEqual(validAddress)
    expect(result.current[1]).toBeUndefined()
    expect(result.current[2]).toBeFalsy()
    expect(web3Provider.resolveName).not.toHaveBeenCalled()

    jest.advanceTimersByTime(301)

    expect(web3Provider.resolveName).not.toHaveBeenCalled()
  })

  it('should accept EIP-3770 addresses with correct chain prefix', async () => {
    const prefixedAddress = 'gor:0x1000000000000000000000000000000000000000'

    web3Provider.resolveName = jest.fn()
    jest.spyOn(useWeb3, 'useWeb3').mockImplementation(() => web3Provider)

    jest.spyOn(useChains, 'useChains').mockImplementation(
      () =>
        ({
          data: {
            results: [
              { chainId: '1', shortName: 'eth' },
              { chainId: '5', shortName: 'gor' },
            ],
          },
        } as UseQueryResult<ChainListResponse, unknown>),
    )

    jest.useFakeTimers()

    const { result } = renderHook(() => useEnsResolution(prefixedAddress))

    expect(result.current[0]).toEqual(prefixedAddress.slice(4))
    expect(result.current[1]).toBeUndefined()
    expect(result.current[2]).toBeFalsy()
    expect(web3Provider.resolveName).not.toHaveBeenCalled()

    jest.advanceTimersByTime(301)

    expect(web3Provider.resolveName).not.toHaveBeenCalled()
  })

  it('should not accept EIP 3770 addresses with wrong chain prefix', async () => {
    const prefixedAddress = 'eth:0x1000000000000000000000000000000000000000'

    web3Provider.resolveName = jest.fn()
    jest.spyOn(useWeb3, 'useWeb3').mockImplementation(() => web3Provider)

    jest.spyOn(useChains, 'useChains').mockImplementation(
      () =>
        ({
          data: {
            results: [
              { chainId: '1', shortName: 'eth' },
              { chainId: '5', shortName: 'gor' },
            ],
          },
        } as UseQueryResult<ChainListResponse, unknown>),
    )

    jest.useFakeTimers()

    const { result } = renderHook(() => useEnsResolution(prefixedAddress))

    expect(result.current[0]).toBeUndefined()
    expect(result.current[1]).toEqual(
      'The chain prefix does not match that of the current chain (gor)',
    )
    expect(result.current[2]).toBeFalsy()
    expect(web3Provider.resolveName).not.toHaveBeenCalled()

    jest.advanceTimersByTime(301)

    expect(web3Provider.resolveName).not.toHaveBeenCalled()
  })

  it('should checksum given address and not trigger ENS resolution', async () => {
    const checksummedAddress = '0x571a651965976752BaF5832B545794dD50e766ba'

    web3Provider.resolveName = jest.fn()
    jest.spyOn(useWeb3, 'useWeb3').mockImplementation(() => web3Provider)

    jest.useFakeTimers()

    const { result } = renderHook(() => useEnsResolution(checksummedAddress.toLowerCase()))

    expect(result.current[0]).toEqual(checksummedAddress)
    expect(result.current[1]).toBeUndefined()
    expect(result.current[2]).toBeFalsy()
    expect(web3Provider.resolveName).not.toHaveBeenCalled()

    jest.advanceTimersByTime(301)

    expect(web3Provider.resolveName).not.toHaveBeenCalled()
  })

  it('should return immediately for empty strings and not trigger ens resolution', async () => {
    web3Provider.resolveName = jest.fn()
    jest.spyOn(useWeb3, 'useWeb3').mockImplementation(() => web3Provider)

    jest.useFakeTimers()

    const { result } = renderHook(() => useEnsResolution(''))

    expect(result.current[0]).toBeUndefined()
    expect(result.current[1]).toBeUndefined()
    expect(result.current[2]).toBeFalsy()
    expect(web3Provider.resolveName).not.toHaveBeenCalled()

    jest.advanceTimersByTime(301)

    expect(web3Provider.resolveName).not.toHaveBeenCalled()
  })

  it('should set error for unexpected errors during ENS resolution', async () => {
    web3Provider.resolveName = jest.fn(() => Promise.reject('Unexpected errors.'))
    jest.spyOn(useWeb3, 'useWeb3').mockImplementation(() => web3Provider)

    jest.useFakeTimers()

    const { result } = renderHook(() => useEnsResolution('test.eth'))

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
    expect(result.current[1]).toEqual('Error while resolving ENS')
    expect(result.current[2]).toBeFalsy()
  })

  it('should resolve ENS names after 300ms', async () => {
    const resolvedAddress = '0x1000000000000000000000000000000000000000'

    web3Provider.resolveName = jest.fn(() => Promise.resolve(resolvedAddress))
    jest.spyOn(useWeb3, 'useWeb3').mockImplementation(() => web3Provider)

    jest.useFakeTimers()
    const { result } = renderHook(() => useEnsResolution('test.eth'))

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

  it('should debounce ENS resolution', async () => {
    const resolvedAddress = '0x1000000000000000000000000000000000000000'

    web3Provider.resolveName = jest.fn(() => Promise.resolve(resolvedAddress))
    jest.spyOn(useWeb3, 'useWeb3').mockImplementation(() => web3Provider)

    jest.useFakeTimers()

    const { result, rerender } = renderHook(({ ens }) => useEnsResolution(ens), {
      initialProps: { ens: 'test.eth' },
    })

    expect(result.current[0]).toBeUndefined()
    expect(result.current[1]).toBeUndefined()
    expect(result.current[2]).toBeFalsy()
    expect(web3Provider.resolveName).not.toHaveBeenCalled()

    jest.advanceTimersByTime(299)

    expect(result.current[0]).toBeUndefined()
    expect(result.current[1]).toBeUndefined()
    expect(result.current[2]).toBeFalsy()
    expect(web3Provider.resolveName).not.toHaveBeenCalled()

    rerender({ ens: 'test2.eth' })

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
    expect(result.current[0]).toEqual(resolvedAddress)
    expect(result.current[1]).toBeUndefined()
    expect(result.current[2]).toBeFalsy()
  })

  it('should trigger ENS resolution multiple times when slowly typing', async () => {
    const resolvedAddress = '0x1000000000000000000000000000000000000000'

    web3Provider.resolveName = jest
      .fn()
      .mockImplementationOnce(() => Promise.resolve(null))
      .mockImplementationOnce(() => Promise.resolve(null))
      .mockImplementationOnce(() => Promise.resolve(resolvedAddress))
    jest.spyOn(useWeb3, 'useWeb3').mockImplementation(() => web3Provider)

    jest.useFakeTimers()

    const { result, rerender } = renderHook(({ ens }) => useEnsResolution(ens), {
      initialProps: { ens: 't' },
    })

    act(() => {
      jest.advanceTimersByTime(310)
    })

    await waitFor(() => {
      expect(result.current[2]).toBeFalsy()
    })

    expect(web3Provider.resolveName).toHaveBeenCalledTimes(1)
    expect(result.current[0]).toBeUndefined()
    expect(result.current[1]).toEqual('Invalid ENS')
    expect(result.current[2]).toBeFalsy()

    rerender({ ens: 'te' })

    act(() => {
      jest.advanceTimersByTime(120)
    })

    rerender({ ens: 'tes' })

    act(() => {
      jest.advanceTimersByTime(120)
    })

    rerender({ ens: 'test' })

    act(() => {
      jest.advanceTimersByTime(320)
    })

    await waitFor(() => {
      expect(result.current[2]).toBeFalsy()
    })

    expect(result.current[0]).toBeUndefined()
    expect(result.current[1]).toEqual('Invalid ENS')
    expect(result.current[2]).toBeFalsy()

    rerender({ ens: 'test.' })

    act(() => {
      jest.advanceTimersByTime(120)
    })

    rerender({ ens: 'test.e' })

    act(() => {
      jest.advanceTimersByTime(120)
    })

    rerender({ ens: 'test.et' })

    act(() => {
      jest.advanceTimersByTime(120)
    })

    rerender({ ens: 'test.eth' })

    act(() => {
      jest.advanceTimersByTime(310)
    })

    await waitFor(() => {
      expect(result.current[2]).toBeFalsy()
    })

    expect(web3Provider.resolveName).toHaveBeenCalledTimes(3)

    expect(result.current[0]).toEqual(resolvedAddress)
    expect(result.current[1]).toBeUndefined()
    expect(result.current[2]).toBeFalsy()
  })

  it('should set error if resolved address is the same as the current Safe address', async () => {
    const resolvedAddress = '0x2000000000000000000000000000000000000000'

    jest.spyOn(SafeAppsSdk, 'useSafeAppsSDK').mockImplementation(
      () =>
        ({
          safe: {
            chainId: 1,
            safeAddress: resolvedAddress,
          },
        } as ReturnType<typeof SafeAppsSdk.useSafeAppsSDK>),
    )

    web3Provider.resolveName = jest.fn(() => Promise.resolve(resolvedAddress))
    jest.spyOn(useWeb3, 'useWeb3').mockImplementation(() => web3Provider)

    jest.useFakeTimers()

    const { result } = renderHook(() => useEnsResolution('test.eth'))

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
    expect(result.current[1]).toEqual('You cannot delegate to your own Safe')
    expect(result.current[2]).toBeFalsy()
  })

  it('should set error if given address is the same as the current Safe address', async () => {
    const resolvedAddress = '0x2000000000000000000000000000000000000000'

    jest.spyOn(SafeAppsSdk, 'useSafeAppsSDK').mockImplementation(
      () =>
        ({
          safe: {
            chainId: 1,
            safeAddress: resolvedAddress,
          },
        } as ReturnType<typeof SafeAppsSdk.useSafeAppsSDK>),
    )

    jest.spyOn(useWeb3, 'useWeb3').mockImplementation(() => web3Provider)

    jest.useFakeTimers()

    const { result } = renderHook(() => useEnsResolution(resolvedAddress))

    expect(web3Provider.resolveName).not.toHaveBeenCalled()
    expect(result.current[0]).toEqual(resolvedAddress)
    expect(result.current[1]).toEqual('You cannot delegate to your own Safe')
    expect(result.current[2]).toBeFalsy()
  })

  it('should set error if no provider is found', async () => {
    jest.spyOn(useWeb3, 'useWeb3').mockImplementation(() => undefined)

    web3Provider.resolveName = jest.fn()

    jest.useFakeTimers()

    const { result } = renderHook(() => useEnsResolution('test.eth'))

    act(() => {
      jest.advanceTimersByTime(301)
    })

    await waitFor(() => {
      expect(result.current[2]).toBeFalsy()
    })

    expect(result.current[0]).toBeUndefined()
    expect(result.current[1]).toEqual('Unable to load provider')
    expect(result.current[2]).toBeFalsy()
    expect(web3Provider.resolveName).not.toHaveBeenCalled()
  })
})
