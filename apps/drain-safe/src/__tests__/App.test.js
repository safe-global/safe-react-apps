import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { within } from '@testing-library/dom';
import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk';
import useBalances from '../hooks/use-balances';
import { mockTxsRequest, mockInitialBalances, renderWithProviders } from '../utils/test-helpers';
import App from '../components/App';

jest.mock('@gnosis.pm/safe-apps-react-sdk', () => {
  const originalModule = jest.requireActual('@gnosis.pm/safe-apps-react-sdk');
  const sdk = {
    sdk: {
      txs: { send: jest.fn().mockResolvedValue({ safeTxHash: 'safeTxHash' }) },
      safe: {
        experimental_getBalances: () =>
          Promise.resolve({
            items: mockInitialBalances,
          }),
      },
    },
    safe: {
      safeAddress: 'safeAddress',
      chainId: 'chainId',
    },
  };

  return {
    ...originalModule,
    useSafeAppsSDK: () => sdk,
  };
});

describe('<App />', () => {
  it('should render the tokens in the safe balance', async () => {
    const { container } = renderWithProviders(<App />);

    expect(await screen.findByText(/ether/i)).toBeInTheDocument();
    expect(await screen.findByText(/0.949938510499549077/)).toBeInTheDocument();
  });

  it('should drain the safe when submit button is clicked', async () => {
    const { container } = renderWithProviders(<App />);
    const { sdk } = useSafeAppsSDK();

    await screen.findByText(/chainLink token/i);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: '0x301812eb4c89766875eFe61460f7a8bBC0CadB96' } });
    fireEvent.click(screen.getByText(/transfer everything/i));
    await waitFor(() => expect(sdk.txs.send).toHaveBeenCalledWith(mockTxsRequest));
  });

  it('should drain the safe when submit button is clicked removing the tokens excluded by the user', async () => {
    const { container } = renderWithProviders(<App />);
    const { sdk } = useSafeAppsSDK();
    const checkboxes = await screen.findAllByRole('checkbox');

    fireEvent.click(checkboxes[1]);
    fireEvent.click(checkboxes[3]);
    fireEvent.click(checkboxes[4]);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: '0x301812eb4c89766875eFe61460f7a8bBC0CadB96' } });
    fireEvent.click(screen.getByText(/transfer everything/i));

    await waitFor(() =>
      expect(sdk.txs.send).toHaveBeenCalledWith({
        txs: [mockTxsRequest.txs[0], mockTxsRequest.txs[2]],
      }),
    );
  });

  it('should show an error if no recipient address is entered', async () => {
    const { container } = renderWithProviders(<App />);

    await screen.findByText(/chainLink token/i);
    fireEvent.click(screen.getByText(/transfer everything/i));

    expect(await screen.findByText(/please enter a valid recipient address/i)).toBeInTheDocument();
  });

  it('should allow to order token by string prop', async () => {
    const { container, debug } = renderWithProviders(<App />);

    await screen.findByText(/chainLink token/i);
    fireEvent.click(screen.getByText(/asset/i));
    const tableRows = document.querySelectorAll('tbody tr');

    expect(within(tableRows[0]).getByText(/chainLink token/i)).toBeDefined();
    expect(within(tableRows[4]).getByText(/uniswap/i)).toBeDefined();
  });

  it('should allow to order token by numeric prop', async () => {
    const { container, debug } = renderWithProviders(<App />);

    await screen.findByText(/chainLink token/i);
    fireEvent.click(screen.getByText(/amount/i));
    const tableRows = document.querySelectorAll('tbody tr');

    expect(within(tableRows[0]).getByText(/dai/i)).toBeDefined();
    expect(within(tableRows[4]).getByText(/maker/i)).toBeDefined();
  });
});
