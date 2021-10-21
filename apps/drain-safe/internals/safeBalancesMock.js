export const SAFE_BALANCES = {
  sdk: {
    safe: {
      experimental_getBalances: jest.fn().mockResolvedValue({
        fiatTotal: '4063.8023599999997',
        items: [
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
            fiatBalance: '3990.10272',
            fiatConversion: '4200.38',
          },
          {
            tokenInfo: {
              type: 'ERC20',
              address: '0x01BE23585060835E02B77ef475b0Cc51aA1e0709',
              decimals: 18,
              symbol: 'LINK',
              name: 'ChainLink Token',
              logoUri:
                'https://gnosis-safe-token-logos.s3.amazonaws.com/0x01BE23585060835E02B77ef475b0Cc51aA1e0709.png',
            },
            balance: '10000000000000000000',
            fiatBalance: '73.69964',
            fiatConversion: '7.369964597268986',
          },
        ],
      }),
    },
    tx: {
      send: jest.fn({
        fiatTotal: '4063.8023599999997',
        items: [
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
            fiatBalance: '3990.10272',
            fiatConversion: '4200.38',
          },
          {
            tokenInfo: {
              type: 'ERC20',
              address: '0x01BE23585060835E02B77ef475b0Cc51aA1e0709',
              decimals: 18,
              symbol: 'LINK',
              name: 'ChainLink Token',
              logoUri:
                'https://gnosis-safe-token-logos.s3.amazonaws.com/0x01BE23585060835E02B77ef475b0Cc51aA1e0709.png',
            },
            balance: '10000000000000000000',
            fiatBalance: '73.69964',
            fiatConversion: '7.369964597268986',
          },
        ],
      }),
    },
  },
  safe: {
    safeAddress: '0x301812eb4c89766875eFe61460f7a8bBC0CadB96',
    network: 'RINKEBY',
    chainId: 4,
    owners: ['0xD725e11588f040d86c4C49d8236E32A5868549F0'],
    threshold: 1,
  },
};
