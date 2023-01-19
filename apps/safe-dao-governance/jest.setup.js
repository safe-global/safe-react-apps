import '@testing-library/jest-dom/extend-expect'

// @web3-onboard
jest.mock('@web3-onboard/coinbase', () => jest.fn())
jest.mock('@web3-onboard/injected-wallets', () => ({
  ProviderLabel: { MetaMask: 'MetaMask' },
}))
jest.mock('@web3-onboard/keystone/dist/index', () => jest.fn())
jest.mock('@web3-onboard/ledger', () => jest.fn())
jest.mock('@web3-onboard/trezor', () => jest.fn())
jest.mock('@web3-onboard/walletconnect', () => jest.fn())
jest.mock('@web3-onboard/tallyho', () => jest.fn())

jest.mock('@web3-onboard/injected-wallets/dist/icons/metamask', () => '')
jest.mock('@web3-onboard/coinbase/dist/icon', () => '')
jest.mock('@web3-onboard/keystone/dist/icon', () => '')
jest.mock('@web3-onboard/walletconnect/dist/icon', () => '')
jest.mock('@web3-onboard/trezor/dist/icon', () => '')
jest.mock('@web3-onboard/ledger/dist/icon', () => '')
jest.mock('@web3-onboard/tallyho/dist/icon', () => '')

const mockOnboardState = {
  chains: [],
  walletModules: [],
  wallets: [],
  accountCenter: {},
}

jest.mock('@web3-onboard/core', () => () => ({
  connectWallet: jest.fn(),
  disconnectWallet: jest.fn(),
  setChain: jest.fn(),
  state: {
    select: key => ({
      subscribe: next => {
        next(mockOnboardState[key])

        return {
          unsubscribe: jest.fn(),
        }
      },
    }),
    get: () => mockOnboardState,
  },
}))
