import { encodeTxData, tokenToTx } from '../utils/sdk-helpers'
import erc20 from '../abis/erc20'

// Axios is bundled as ESM module which is not directly compatible with Jest
// https://jestjs.io/docs/ecmascript-modules
jest.mock('axios', () => ({
  get: jest.fn(),
  post: jest.fn(),
  delete: jest.fn(),
}))

describe('Safe SDK helpers', () => {
  describe('encodeTxData', () => {
    it('encodes a simple transfer call', () => {
      const data = encodeTxData(erc20.transfer, '0xb3b83bf204C458B461de9B0CD2739DB152b4fa5A', 1000)
      expect(data).toEqual(
        '0xa9059cbb000000000000000000000000b3b83bf204c458b461de9b0cd2739db152b4fa5a00000000000000000000000000000000000000000000000000000000000003e8',
      )

      const data2 = encodeTxData(erc20.transfer, '0xb3b83bf204C458B461de9B0CD2739DB152b4fa5A', 1)
      expect(data2).toEqual(
        '0xa9059cbb000000000000000000000000b3b83bf204c458b461de9b0cd2739db152b4fa5a0000000000000000000000000000000000000000000000000000000000000001',
      )
    })

    it('fails on invalid address', () => {
      const badAddress = '0xb3b83bf204C458B46'
      expect(() => encodeTxData(erc20.transfer, badAddress, 1000)).toThrow(
        `Given address "${badAddress}" is not a valid Ethereum address.`,
      )
    })
  })

  describe('tokenToTx', () => {
    it('creats a tx for a ERC-20 token', () => {
      const tx = tokenToTx('0xb3b83bf204C458B461de9B0CD2739DB152b4fa5A', {
        token: {
          decimals: 18,
          symbol: 'DAI',
          name: 'Dai',
          logoUri:
            'https://safe-transaction-assets.staging.5afe.dev/0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa.png',
        },
        tokenInfo: {
          type: 'ERC20',
          address: '0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa',
        },
        balance: '20000000000000000000000',
        fiatBalance: '136972.3434',
        fiatConversion: '6.8486',
      })

      expect(tx).toEqual({
        to: '0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa',
        value: '0',
        data: '0xa9059cbb000000000000000000000000b3b83bf204c458b461de9b0cd2739db152b4fa5a00000000000000000000000000000000000000000000043c33c1937564800000',
      })
    })

    it('creats a tx for ETH', () => {
      const tx = tokenToTx('0xb3b83bf204C458B461de9B0CD2739DB152b4fa5A', {
        token: null,
        balance: '2000000000000000000',
        fiatBalance: '4574.8946',
        fiatConversion: '2287.4473',
        tokenInfo: { type: 'NATIVE_TOKEN', address: null },
      })

      expect(tx).toEqual({
        to: '0xb3b83bf204C458B461de9B0CD2739DB152b4fa5A',
        value: '2000000000000000000',
        data: '0x',
      })
    })
  })
})
