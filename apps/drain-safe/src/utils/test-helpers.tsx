import { ThemeProvider } from 'styled-components';
import { render } from '@testing-library/react';

export const mockTheme = {
  buttons: {
    size: {
      lg: { height: '' },
    },
  },
  colors: {
    disabled: {
      opacity: 0,
    },
  },
  fonts: {
    fontFamily: '',
  },
  text: {
    size: {
      xl: {
        fontSize: '',
        lineHeight: '',
      },
    },
  },
  title: {
    size: {
      md: {
        fontSize: '32px',
        lineHeight: '36px',
      },
    },
  },
};

export const mockTxsRequest = {
  txs: [
    {
      data: '0x',
      to: '0x301812eb4c89766875eFe61460f7a8bBC0CadB96',
      value: '949938510499549077',
    },
    {
      data: '0xa9059cbb000000000000000000000000301812eb4c89766875efe61460f7a8bbc0cadb960000000000000000000000000000000000000000000000008ac7230489e80000',
      to: '0x01BE23585060835E02B77ef475b0Cc51aA1e0709',
      value: '0',
    },
  ],
};

export const mockInitialBalances = [
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
];

export function renderWithProviders(ui: JSX.Element) {
  return {
    ...render(<ThemeProvider theme={mockTheme}>{ui}</ThemeProvider>),
  };
}
