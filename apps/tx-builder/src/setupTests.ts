// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect'
import { ChainInfo, SafeInfo } from '@gnosis.pm/safe-apps-sdk'

const TEST_SAFE_MOCK: SafeInfo = {
  safeAddress: '0x57CB13cbef735FbDD65f5f2866638c546464E45F',
  chainId: 4,
  isReadOnly: false,
  owners: ['0x680cde08860141F9D223cE4E620B10Cd6741037E'],
  threshold: 2,
}

const CHAIN_INFO_MOCK: ChainInfo = {
  chainId: '4',
  chainName: 'Rinkeby',
  nativeCurrency: {
    decimals: 18,
    logoUri: 'https://test/currency_logo.png',
    name: 'Ether',
    symbol: 'ETH',
  },
  shortName: 'rin',
}

jest.mock('@gnosis.pm/safe-apps-react-sdk', () => {
  const originalModule = jest.requireActual('@gnosis.pm/safe-apps-react-sdk')
  return {
    ...originalModule,
    useSafeAppsSDK: () => ({
      sdk: {
        txs: {
          send: () => {},
          signMessage: () => {},
        },
        safe: {
          getChainInfo: () => Promise.resolve(CHAIN_INFO_MOCK),
        },
        eth: {},
      },
      safe: TEST_SAFE_MOCK,
    }),
  }
})
