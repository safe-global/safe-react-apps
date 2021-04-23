import '@testing-library/jest-dom'
import * as React from 'react';
import {render, screen, waitFor} from '@testing-library/react'
import App from '../App';
import * as Gateway from '../utils/gateway';

jest.mock('@gnosis.pm/safe-react-components', () => ({
  Button: () => null,
  Loader: () => null,
  Title: () => null,
  TextField: () => null,
  Text: () => null,
  Table: (props: any) => (
    <div data-test-id="table">
      {JSON.stringify(props.rows)}
    </div>
  )
}));

jest.mock('@gnosis.pm/safe-apps-react-sdk', () => ({
  __esModule: true,
  useSafeAppsSDK: () => ({
    safe: {
      safeAddress: '0xb3b83bf204C458B461de9B0CD2739DB152b4fa5A',
      network: 'rinkeby'
    },
    sdk: {
      txs: {
        send: jest.fn().mockResolvedValue({ safeTxHash: '0x' })
      }
    }
  })
}));

jest.mock('../utils/gateway');

Gateway.fetchSafeAssets.mockResolvedValue({
  fiatTotal: '140178.5160103226',
  items: [
    {
      tokenInfo: {
        type: 'ERC20',
        address: '0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa',
        decimals: 18,
        symbol: 'DAI',
        name: 'Dai',
        logoUri: 'https://gnosis-safe-token-logos.s3.amazonaws.com/0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa.png',
      },
      balance: '20000000000000000000000',
      fiatBalance: '126429.12214741918',
      fiatConversion: '6.321428690046399',
    },
    {
      tokenInfo: {
        type: 'ERC20',
        address: '0x4DBCdF9B62e891a7cec5A2568C3F4FAF9E8Abe2b',
        decimals: 6,
        symbol: 'USDC',
        name: 'USD Coin',
        logoUri: 'https://gnosis-safe-token-logos.s3.amazonaws.com/0x4DBCdF9B62e891a7cec5A2568C3F4FAF9E8Abe2b.png',
      },
      balance: '600000000',
      fiatBalance: '7848.718227621917',
      fiatConversion: '13.081185836651866',
    },
    {
      tokenInfo: {
        type: 'ETHER',
        address: '0x0000000000000000000000000000000000000000',
        decimals: 18,
        symbol: 'ETH',
        name: 'Ether',
        logoUri: null,
      },
      balance: '2000000000000000000',
      fiatBalance: '4222.749570722084',
      fiatConversion: '2111.374785361042',
    },
    {
      tokenInfo: {
        type: 'ERC20',
        address: '0xa7D1C04fAF998F9161fC9F800a99A809b84cfc9D',
        decimals: 18,
        symbol: 'OWL',
        name: 'OWL Token',
        logoUri: 'https://gnosis-safe-token-logos.s3.amazonaws.com/0xa7D1C04fAF998F9161fC9F800a99A809b84cfc9D.png',
      },
      balance: '999000000000000000000',
      fiatBalance: '1677.9260645594131',
      fiatConversion: '1.679580984898053',
    },
  ],
});

describe('App component tests', () => {
  it('should fetch and render the balances', async () => {
    render(
      <App />
    );

    expect(Gateway.fetchSafeAssets).toHaveBeenCalled();

    const table = await waitFor(() => {
      return screen.findByText(/fiatBalance/);
    });
    expect(table).toBe({});
  });
});
