import { JsonRpcProvider } from '@ethersproject/providers'
import type { JsonRpcSigner } from '@ethersproject/providers'

import { _getIsTokenPaused } from '@/hooks/useIsTokenPaused'
import { SafeToken__factory } from '@/types/contracts/safe-token'

const safeTokenInterface = SafeToken__factory.createInterface()

describe('_getIsTokenPaused', () => {
  let web3Provider: JsonRpcProvider
  let mockCall: jest.Mock

  beforeEach(() => {
    web3Provider = new JsonRpcProvider()
    mockCall = jest.fn()

    web3Provider.call = mockCall

    jest.spyOn(web3Provider, 'getSigner').mockImplementation(
      jest.fn(
        () =>
          ({
            getChainId: jest.fn(() => Promise.resolve(5)),
          } as unknown as JsonRpcSigner),
      ),
    )
  })
  it('should return true on error', async () => {
    mockCall.mockImplementation(() => Promise.reject())

    const result = await _getIsTokenPaused(web3Provider)

    expect(result).toBeTruthy()
    expect(mockCall).toBeCalledTimes(1)
  })

  it('should return true if token is paused', async () => {
    mockCall.mockImplementation(async () =>
      Promise.resolve(safeTokenInterface.encodeFunctionResult('paused', [true])),
    )

    const result = await _getIsTokenPaused(web3Provider)

    expect(result).toBeTruthy()
    expect(mockCall).toBeCalledTimes(1)
  })

  it('should return false if token is unpaused', async () => {
    mockCall.mockImplementation(async () =>
      Promise.resolve(safeTokenInterface.encodeFunctionResult('paused', [false])),
    )

    const result = await _getIsTokenPaused(web3Provider)

    expect(result).toBeFalsy()
    expect(mockCall).toBeCalledTimes(1)
  })

  it('returns null if no provider is defined', async () => {
    const result = await _getIsTokenPaused(undefined)

    expect(result).toBe(null)
  })

  it('returns null if no Safe Token address is found for the current chain', async () => {
    jest.spyOn(web3Provider, 'getSigner').mockImplementationOnce(
      jest.fn(
        () =>
          ({
            getChainId: jest.fn(() => Promise.resolve(0)),
          } as unknown as JsonRpcSigner),
      ),
    )

    const result = await _getIsTokenPaused(undefined)

    expect(result).toBe(null)
  })
})
