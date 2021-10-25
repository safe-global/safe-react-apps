import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import * as safeAppsSdk from '@gnosis.pm/safe-apps-react-sdk';
import useBalances from '../hooks/use-balances';
import { mockTxsRequest, mockInitialBalances, renderWithProviders } from '../utils/test-helpers';
import App from '../components/App';

const mockSendTxs = jest.fn().mockResolvedValue({ safeTxHash: 'safeTxHash' });

jest.mock('@gnosis.pm/safe-apps-react-sdk', () => ({
  useSafeAppsSDK: () => ({
    sdk: {
      txs: { send: mockSendTxs },
      safe: {
        experimental_getBalances: jest.fn().mockResolvedValue({
          items: mockInitialBalances,
        }),
      },
    },
    safe: {
      safeAddress: 'safeAddress',
      chainId: 'chainId',
    },
  }),
}));

describe('<App />', () => {
  it('should render the tokens in the safe balance', async () => {
    const { container, debug } = renderWithProviders(<App />);

    expect(await screen.findByText(/ether/i)).toBeInTheDocument();
    expect(await screen.findByText(/0.949938510499549077/)).toBeInTheDocument();
  });

  it('should drain the safe when submit button is clicked', async () => {
    const { container, debug } = renderWithProviders(<App />);

    await screen.findByText(/chainLink token/i);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: '0x301812eb4c89766875eFe61460f7a8bBC0CadB96' } });
    fireEvent.click(screen.getByText(/transfer everything/i));

    expect(mockSendTxs).toHaveBeenCalledWith(mockTxsRequest);
  });

  it('should drain the safe when submit button is clicked removing the spam tokens selected by the user', async () => {
    const { container, debug } = renderWithProviders(<App />);

    fireEvent.click((await screen.findAllByRole('checkbox'))[1]);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: '0x301812eb4c89766875eFe61460f7a8bBC0CadB96' } });
    fireEvent.click(screen.getByText(/transfer everything/i));

    await waitFor(() =>
      expect(mockSendTxs).toHaveBeenCalledWith({
        txs: [mockTxsRequest.txs[0]],
      }),
    );
  });

  it('should show an error if no recipient address is entered', async () => {
    const { container, debug } = renderWithProviders(<App />);

    await screen.findByText(/chainLink token/i);
    fireEvent.click(screen.getByText(/transfer everything/i));

    expect(await screen.findByText(/please enter a valid recipient address/i)).toBeInTheDocument();
  });
});
