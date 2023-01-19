import { defaultAbiCoder, hexZeroPad, keccak256, parseEther, toUtf8Bytes } from 'ethers/lib/utils'
import { BigNumber } from 'ethers'
import { JsonRpcProvider } from '@ethersproject/providers'
import type { JsonRpcSigner } from '@ethersproject/providers'
import type { TransactionRequest } from '@ethersproject/abstract-provider'
import type { Deferrable } from '@ethersproject/properties'

import { _getSafeTokenAllocation } from '@/hooks/useSafeTokenAllocation'
import { ZERO_ADDRESS } from '@/config/constants'

const SAFE_ADDRESS = '0x0000000000000000000000000000000000000002'

const setupFetchStub =
  (data: unknown, status = 200) =>
  () => {
    return Promise.resolve({
      json: () => Promise.resolve(data),
      status,
      ok: status === 200,
    })
  }

describe('_getSafeTokenAllocation', () => {
  const web3Provider = new JsonRpcProvider()

  const mockCall = jest.fn()

  web3Provider.call = mockCall

  afterEach(() => {
    // @ts-expect-error mockClear is not defined in the type definition
    global.fetch?.mockClear?.()
  })

  afterAll(() => {
    // @ts-expect-error shouldn't delete global.fetch
    delete global.fetch
  })

  beforeEach(() => {
    jest.resetAllMocks()

    jest.spyOn(web3Provider, 'getSigner').mockImplementation(
      jest.fn(
        () =>
          ({
            getChainId: jest.fn(() => Promise.resolve(5)),
            getAddress: jest.fn(() => Promise.resolve(SAFE_ADDRESS)),
          } as unknown as JsonRpcSigner),
      ),
    )
  })

  it('returns null if no provider is defined', async () => {
    const result = await _getSafeTokenAllocation(undefined)

    expect(result).toBe(null)
  })

  it('return 0 if no allocations / balances exist', async () => {
    global.fetch = jest.fn().mockImplementation(setupFetchStub('', 404))
    const mockFetch = jest.spyOn(global, 'fetch')

    mockCall.mockImplementation((transaction: Deferrable<TransactionRequest>) => {
      const sigHash = keccak256(toUtf8Bytes('balanceOf(address)')).slice(0, 10)
      if (typeof transaction.data === 'string' && transaction.data.startsWith(sigHash)) {
        return Promise.resolve('0x0')
      }
      return Promise.resolve('0x')
    })

    const result = await _getSafeTokenAllocation(web3Provider)

    expect(mockFetch).toHaveBeenCalled()
    expect(result?.votingPower.toNumber()).toEqual(0)
  })

  it('return balance if no allocation exists', async () => {
    global.fetch = jest.fn().mockImplementation(setupFetchStub('', 404))
    const mockFetch = jest.spyOn(global, 'fetch')

    mockCall.mockImplementation((transaction: Deferrable<TransactionRequest>) => {
      const sigHash = keccak256(toUtf8Bytes('balanceOf(address)')).slice(0, 10)
      if (typeof transaction.data === 'string' && transaction.data.startsWith(sigHash)) {
        return Promise.resolve(parseEther('100').toHexString())
      }
      return Promise.resolve('0x')
    })

    const result = await _getSafeTokenAllocation(web3Provider)

    expect(mockFetch).toHaveBeenCalled()
    expect(result?.votingPower.eq(parseEther('100'))).toBeTruthy()
  })

  it('always return allocation if it is redeemed', async () => {
    const mockAllocation = [
      {
        tag: 'user',
        account: hexZeroPad('0x2', 20),
        chainId: 1,
        contract: hexZeroPad('0xabc', 20),
        vestingId: hexZeroPad('0x4110', 32),
        durationWeeks: 208,
        startDate: 1657231200,
        amount: '2000',
        curve: 0,
        proof: [],
      },
    ]

    global.fetch = jest.fn().mockImplementation(setupFetchStub(mockAllocation, 200))
    const mockFetch = jest.spyOn(global, 'fetch')

    mockCall.mockImplementation((transaction: Deferrable<TransactionRequest>) => {
      const balanceOfSigHash = keccak256(toUtf8Bytes('balanceOf(address)')).slice(0, 10)
      const vestingsSigHash = keccak256(toUtf8Bytes('vestings(bytes32)')).slice(0, 10)

      if (typeof transaction.data === 'string' && transaction.data.startsWith(balanceOfSigHash)) {
        return Promise.resolve(parseEther('0').toHexString())
      }
      if (typeof transaction.data === 'string' && transaction.data.startsWith(vestingsSigHash)) {
        return Promise.resolve(
          defaultAbiCoder.encode(
            [
              'address',
              'uint8',
              'bool',
              'uint16',
              'uint64',
              'uint128',
              'uint128',
              'uint64',
              'bool',
            ],
            [hexZeroPad('0x2', 20), '0x1', false, 208, 1657231200, 2000, 0, 0, false],
          ),
        )
      }
      return Promise.resolve('0x')
    })

    const result = await _getSafeTokenAllocation(web3Provider)

    expect(mockFetch).toHaveBeenCalled()
    expect(result?.votingPower.toNumber()).toEqual(2000)
  })

  it('ignore not redeemed allocations if deadline has passed', async () => {
    const mockAllocation = [
      {
        tag: 'user',
        account: hexZeroPad('0x2', 20),
        chainId: 1,
        contract: hexZeroPad('0xabc', 20),
        vestingId: hexZeroPad('0x4110', 32),
        durationWeeks: 208,
        startDate: 1657231200,
        amount: '2000',
        curve: 0,
        proof: [],
      },
    ]

    global.fetch = jest.fn().mockImplementation(setupFetchStub(mockAllocation, 200))
    const mockFetch = jest.spyOn(global, 'fetch')

    mockCall.mockImplementation((transaction: Deferrable<TransactionRequest>) => {
      const balanceOfSigHash = keccak256(toUtf8Bytes('balanceOf(address)')).slice(0, 10)
      const vestingsSigHash = keccak256(toUtf8Bytes('vestings(bytes32)')).slice(0, 10)
      const redeemDeadlineSigHash = keccak256(toUtf8Bytes('redeemDeadline()')).slice(0, 10)

      if (typeof transaction.data === 'string' && transaction.data.startsWith(balanceOfSigHash)) {
        return Promise.resolve(parseEther('0').toHexString())
      }
      if (typeof transaction.data === 'string' && transaction.data.startsWith(vestingsSigHash)) {
        return Promise.resolve(
          defaultAbiCoder.encode(
            [
              'address',
              'uint8',
              'bool',
              'uint16',
              'uint64',
              'uint128',
              'uint128',
              'uint64',
              'bool',
            ],
            [ZERO_ADDRESS, 0, false, 0, 0, 0, 0, 0, false],
          ),
        )
      }
      if (
        typeof transaction.data === 'string' &&
        transaction.data.startsWith(redeemDeadlineSigHash)
      ) {
        // 30th Nov 2022
        return Promise.resolve(defaultAbiCoder.encode(['uint64'], [1669766400]))
      }
      return Promise.resolve('0x')
    })

    const result = await _getSafeTokenAllocation(web3Provider)

    expect(mockFetch).toHaveBeenCalled()
    expect(result?.votingPower.toNumber()).toEqual(0)
  })

  it('add not redeemed allocations if deadline has not passed', async () => {
    const mockAllocation = [
      {
        tag: 'user',
        account: hexZeroPad('0x2', 20),
        chainId: 1,
        contract: hexZeroPad('0xabc', 20),
        vestingId: hexZeroPad('0x4110', 32),
        durationWeeks: 208,
        startDate: 1657231200,
        amount: '2000',
        curve: 0,
        proof: [],
      },
    ]

    global.fetch = jest.fn().mockImplementation(setupFetchStub(mockAllocation, 200))
    const mockFetch = jest.spyOn(global, 'fetch')

    mockCall.mockImplementation((transaction: Deferrable<TransactionRequest>) => {
      const balanceOfSigHash = keccak256(toUtf8Bytes('balanceOf(address)')).slice(0, 10)
      const vestingsSigHash = keccak256(toUtf8Bytes('vestings(bytes32)')).slice(0, 10)
      const redeemDeadlineSigHash = keccak256(toUtf8Bytes('redeemDeadline()')).slice(0, 10)

      if (typeof transaction.data === 'string' && transaction.data.startsWith(balanceOfSigHash)) {
        return Promise.resolve(parseEther('0').toHexString())
      }
      if (typeof transaction.data === 'string' && transaction.data.startsWith(vestingsSigHash)) {
        return Promise.resolve(
          defaultAbiCoder.encode(
            [
              'address',
              'uint8',
              'bool',
              'uint16',
              'uint64',
              'uint128',
              'uint128',
              'uint64',
              'bool',
            ],
            [ZERO_ADDRESS, 0, false, 0, 0, 0, 0, 0, false],
          ),
        )
      }
      if (
        typeof transaction.data === 'string' &&
        transaction.data.startsWith(redeemDeadlineSigHash)
      ) {
        // 08.Dec 2200
        return Promise.resolve(defaultAbiCoder.encode(['uint64'], [7287610110]))
      }
      return Promise.resolve('0x')
    })

    const result = await _getSafeTokenAllocation(web3Provider)

    expect(mockFetch).toHaveBeenCalled()
    expect(result?.votingPower.toNumber()).toEqual(2000)
  })

  it('test formula: allocation - claimed + balance', async () => {
    const mockAllocation = [
      {
        tag: 'user',
        account: hexZeroPad('0x2', 20),
        chainId: 1,
        contract: hexZeroPad('0xabc', 20),
        vestingId: hexZeroPad('0x4110', 32),
        durationWeeks: 208,
        startDate: 1657231200,
        amount: '2000',
        curve: 0,
        proof: [],
      },
    ]

    global.fetch = jest.fn().mockImplementation(setupFetchStub(mockAllocation, 200))
    const mockFetch = jest.spyOn(global, 'fetch')

    mockCall.mockImplementation((transaction: Deferrable<TransactionRequest>) => {
      const balanceOfSigHash = keccak256(toUtf8Bytes('balanceOf(address)')).slice(0, 10)
      const vestingsSigHash = keccak256(toUtf8Bytes('vestings(bytes32)')).slice(0, 10)
      const redeemDeadlineSigHash = keccak256(toUtf8Bytes('redeemDeadline()')).slice(0, 10)

      if (typeof transaction.data === 'string' && transaction.data.startsWith(balanceOfSigHash)) {
        return Promise.resolve(BigNumber.from('400').toHexString())
      }
      if (typeof transaction.data === 'string' && transaction.data.startsWith(vestingsSigHash)) {
        return Promise.resolve(
          defaultAbiCoder.encode(
            [
              'address',
              'uint8',
              'bool',
              'uint16',
              'uint64',
              'uint128',
              'uint128',
              'uint64',
              'bool',
            ],
            // 1000 of 2000 tokens are claimed
            [hexZeroPad('0x2', 20), '0x1', false, 208, 1657231200, 2000, 1000, 0, false],
          ),
        )
      }
      if (
        typeof transaction.data === 'string' &&
        transaction.data.startsWith(redeemDeadlineSigHash)
      ) {
        // 08.Dec 2200
        return Promise.resolve(defaultAbiCoder.encode(['uint64'], [7287610110]))
      }
      return Promise.resolve('0x')
    })

    const result = await _getSafeTokenAllocation(web3Provider)

    expect(mockFetch).toHaveBeenCalled()
    expect(result?.votingPower.toNumber()).toEqual(2000 - 1000 + 400)
  })

  it('test formula: allocation - claimed + balance, everything claimed and no balance', async () => {
    const mockAllocation = [
      {
        tag: 'user',
        account: hexZeroPad('0x2', 20),
        chainId: 1,
        contract: hexZeroPad('0xabc', 20),
        vestingId: hexZeroPad('0x4110', 32),
        durationWeeks: 208,
        startDate: 1657231200,
        amount: '2000',
        curve: 0,
        proof: [],
      },
    ]

    global.fetch = jest.fn().mockImplementation(setupFetchStub(mockAllocation, 200))
    const mockFetch = jest.spyOn(global, 'fetch')

    mockCall.mockImplementation((transaction: Deferrable<TransactionRequest>) => {
      const balanceOfSigHash = keccak256(toUtf8Bytes('balanceOf(address)')).slice(0, 10)
      const vestingsSigHash = keccak256(toUtf8Bytes('vestings(bytes32)')).slice(0, 10)
      const redeemDeadlineSigHash = keccak256(toUtf8Bytes('redeemDeadline()')).slice(0, 10)

      if (typeof transaction.data === 'string' && transaction.data.startsWith(balanceOfSigHash)) {
        return Promise.resolve(BigNumber.from('0').toHexString())
      }
      if (typeof transaction.data === 'string' && transaction.data.startsWith(vestingsSigHash)) {
        return Promise.resolve(
          defaultAbiCoder.encode(
            [
              'address',
              'uint8',
              'bool',
              'uint16',
              'uint64',
              'uint128',
              'uint128',
              'uint64',
              'bool',
            ],
            // 1000 of 2000 tokens are claimed
            [hexZeroPad('0x2', 20), '0x1', false, 208, 1657231200, 2000, 2000, 0, false],
          ),
        )
      }
      if (
        typeof transaction.data === 'string' &&
        transaction.data.startsWith(redeemDeadlineSigHash)
      ) {
        // 08.Dec 2200
        return Promise.resolve(defaultAbiCoder.encode(['uint64'], [7287610110]))
      }
      return Promise.resolve('0x')
    })

    const result = await _getSafeTokenAllocation(web3Provider)

    expect(mockFetch).toHaveBeenCalled()
    expect(result?.votingPower.toNumber()).toEqual(0)
  })
})
