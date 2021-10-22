import '@testing-library/jest-dom/extend-expect';

jest.mock('./hooks/use-balances.ts', () => ({
  __esModule: true,
  default: () => ({
    assets: [
      {
        tokenInfo: {
          type: 'NATIVE_TOKEN',
          address: '0x0000000000000000000000000000000000000000',
          decimals: 18,
          symbol: 'ETH',
          name: 'Ether',
          logoUri: 'https://safe-transaction-assets.staging.gnosisdev.com/chains/4/currency_logo.png',
        },
        balance: '949938510499549077',
        fiatBalance: '3912.43897',
        fiatConversion: '4118.62339607',
        spam: false,
      },
      {
        tokenInfo: {
          type: 'ERC20',
          address: '0x01BE23585060835E02B77ef475b0Cc51aA1e0709',
          decimals: 18,
          symbol: 'LINK',
          name: 'ChainLink Token',
          logoUri: 'https://gnosis-safe-token-logos.s3.amazonaws.com/0x01BE23585060835E02B77ef475b0Cc51aA1e0709.png',
        },
        balance: '10000000000000000000',
        fiatBalance: '32.17898',
        fiatConversion: '3.2178980896091103',
        spam: false,
      },
    ],
  }),
}));
