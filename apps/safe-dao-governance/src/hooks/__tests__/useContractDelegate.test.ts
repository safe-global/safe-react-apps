import { formatBytes32String, hexZeroPad } from 'ethers/lib/utils'
import { JsonRpcProvider } from '@ethersproject/providers'
import type { JsonRpcSigner } from '@ethersproject/providers'

import { CHAIN_DELEGATE_ID, DELEGATE_REGISTRY_ADDRESS, ZERO_ADDRESS } from '@/config/constants'
import { _getContractDelegate } from '@/hooks/useContractDelegate'

const SAFE_ADDRESS = '0x6a13e0280740cc5bd35eeee33b470b5bbb93df37'

describe('_getContractDelegate()', () => {
  const web3Provider = new JsonRpcProvider()
  const mockCall = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()

    jest.spyOn(web3Provider, 'getSigner').mockImplementation(
      jest.fn(
        () =>
          ({
            _isSigner: true,
            getChainId: jest.fn(() => Promise.resolve(5)),
            getAddress: jest.fn(() => Promise.resolve(SAFE_ADDRESS)),
            call: mockCall,
          } as unknown as JsonRpcSigner),
      ),
    )
  })

  it('returns null if no provider is defined', async () => {
    const result = await _getContractDelegate(undefined)

    expect(result).toBe(null)
  })

  it('ignore the ZERO_ADDRESS as delegate', async () => {
    const delegateIDInBytes = formatBytes32String(CHAIN_DELEGATE_ID[5])

    mockCall.mockImplementation(transaction => {
      expect(transaction.to?.toString().toLowerCase()).toEqual(
        DELEGATE_REGISTRY_ADDRESS.toLowerCase(),
      )

      expect(transaction.data?.toString().toLowerCase()).toContain(
        SAFE_ADDRESS.toLowerCase().slice(2),
      )

      expect(transaction.data?.toString().toLowerCase()).toContain(
        delegateIDInBytes.toLowerCase().slice(2),
      )

      return Promise.resolve(hexZeroPad(ZERO_ADDRESS, 32))
    })

    const result = await _getContractDelegate(web3Provider)

    expect(mockCall).toBeCalledTimes(1)
    expect(result).toBe(null)
  })

  it('should encode the correct data and fetch the delegate on-chain once', async () => {
    const delegateIDInBytes = formatBytes32String(CHAIN_DELEGATE_ID[5])

    const delegateAddress = hexZeroPad('0x1', 20)

    mockCall.mockImplementation(transaction => {
      expect(transaction.to?.toString().toLowerCase()).toEqual(
        DELEGATE_REGISTRY_ADDRESS.toLowerCase(),
      )

      expect(transaction.data?.toString().toLowerCase()).toContain(
        SAFE_ADDRESS.toLowerCase().slice(2),
      )

      expect(transaction.data?.toString().toLowerCase()).toContain(
        delegateIDInBytes.toLowerCase().slice(2),
      )

      return Promise.resolve(hexZeroPad(delegateAddress, 32))
    })

    const result = await _getContractDelegate(web3Provider)

    expect(mockCall).toBeCalledTimes(1)
    expect(result).toEqual({ address: delegateAddress })
  })
})
