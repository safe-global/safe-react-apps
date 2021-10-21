import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import * as safeAppsSdk from '@gnosis.pm/safe-apps-react-sdk';
import useBalances from '../hooks/use-balances';
import App from '../components/App';
import renderWithProviders from '../../internals/renderWithProviders';

const mockSendTxs = jest.fn().mockResolvedValue({ safeTxHash: 'safeTxHash' });

jest.mock('@gnosis.pm/safe-apps-react-sdk', () => ({
  useSafeAppsSDK: () => ({
    sdk: { txs: { send: mockSendTxs } },
    safe: {
      safeAddress: '0x301812eb4c89766875eFe61460f7a8bBC0CadB96',
      network: 'RINKEBY',
      chainId: 4,
      owners: ['0xD725e11588f040d86c4C49d8236E32A5868549F0'],
      threshold: 1,
    },
  }),
}));

jest.mock('../hooks/use-balances.ts', () => ({
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

const TXS_REQUEST = {
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

describe('<App />', () => {
  it('should render the tokens in the safe balance', async () => {
    const { container, debug } = renderWithProviders(<App />);

    expect(await screen.findByText('Ether')).toBeInTheDocument();
    expect(await screen.findByText('0.949938510499549077')).toBeInTheDocument();
  });

  it('should drain the safe when submit button is clicked', async () => {
    const { container, debug } = renderWithProviders(<App />);

    await screen.findByText('ChainLink Token');
    fireEvent.change(screen.getByRole('textbox'), { target: { value: '0x301812eb4c89766875eFe61460f7a8bBC0CadB96' } });
    fireEvent.click(screen.getByText('Transfer everything'));

    expect(mockSendTxs).toHaveBeenCalledWith(TXS_REQUEST);
  });

  it('should show an error if no recipient address is provided', async () => {
    const { container, debug } = renderWithProviders(<App />);

    await screen.findByText('ChainLink Token');
    fireEvent.click(screen.getByText('Transfer everything'));

    expect(await screen.findByText('Please enter a valid recipient address')).toBeInTheDocument();
  });
});
