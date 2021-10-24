import { ThemeProvider } from 'styled-components';
import { render } from '@testing-library/react';
import React from 'react';

export const mockTheme = {
  buttons: {
    size: {
      md: { height: '36px', minWidth: '130px', padding: '0 24px' },
      lg: { height: '52px', minWidth: '240px', padding: '0 48px' },
    },
  },
  colors: {
    primary: '#008C73',
    primaryLight: '#A1D2CA',
    primaryHover: '#005546',

    secondary: '#001428',
    secondaryLight: '#B2B5B2',
    secondaryHover: '#5D6D74',

    error: '#DB3A3D',
    errorHover: '#C31717',
    errorTooltip: '#ffe6ea',

    text: '#001428',
    icon: '#B2B5B2',
    placeHolder: '#5D6D74',
    inputField: '#F0EFEE',

    separator: '#E8E7E6',
    rinkeby: '#E8673C',
    pendingTagHover: '#FBE5C5',
    tag: '#D4D5D3',
    background: '#F7F5F5',
    white: '#ffffff',
    warning: '#FFC05F',
    pending: '#E8663D',

    disabled: {
      opacity: 0.5,
    },
    overlay: {
      opacity: 0.75,
      color: '#E8E7E6',
    },
    shadow: {
      blur: '18px',
      opacity: 0.75,
      color: '#28363D',
    },
  },
  statusDot: {
    size: {
      sm: '5px',
      md: '10px',
    },
  },
  fonts: {
    fontFamily: `'Averta', 'Roboto', 'Helvetica Neue', 'Arial', 'Segoe UI', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', '-apple-system', 'BlinkMacSystemFont', sans-serif`,
    fontFamilyCode: `source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace`,
  },
  margin: {
    xxs: '4px',
    xs: '6px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    xxl: '24px',
  },
  icons: {
    size: {
      sm: '16',
      md: '24',
    },
  },
  iconText: {
    size: {
      sm: null,
      md: null,
    },
  },
  identicon: {
    size: {
      xs: '10px',
      sm: '16px',
      md: '32px',
      lg: '40px',
      xl: '48px',
      xxl: '60px',
    },
  },
  loader: {
    size: {
      xxs: '10px',
      xs: '16px',
      sm: '30px',
      md: '50px',
      lg: '70px',
    },
  },
  text: {
    size: {
      sm: {
        fontSize: '11px',
        lineHeight: '14px',
      },
      md: {
        fontSize: '12px',
        lineHeight: '16px',
      },
      lg: {
        fontSize: '14px',
        lineHeight: '20px',
      },
      xl: {
        fontSize: '16px',
        lineHeight: '22px',
      },
    },
  },
  title: {
    size: {
      xs: {
        fontSize: '20px',
        lineHeight: '26px',
      },
      sm: {
        fontSize: '24px',
        lineHeight: '30px',
      },
      md: {
        fontSize: '32px',
        lineHeight: '36px',
      },
      lg: {
        fontSize: '44px',
        lineHeight: '52px',
      },
      xl: {
        fontSize: '60px',
        lineHeight: '64px',
      },
    },
  },
  tooltip: {
    size: {
      md: '',
      lg: '',
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
