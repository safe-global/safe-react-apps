import { screen, fireEvent, createEvent, waitFor } from '@testing-library/react';

import App from './App';
import { renderWithProviders } from './utils/test-helpers';

jest.mock('@gnosis.pm/safe-apps-react-sdk', () => {
  const originalModule = jest.requireActual('@gnosis.pm/safe-apps-react-sdk');
  return {
    ...originalModule,
    useSafeAppsSDK: () => ({
      sdk: {
        txs: {
          send: () => {},
          signMessage: () => {},
        },
      },
      safe: {
        safeAddress: '0x57CB13cbef735FbDD65f5f2866638c546464E45F',
        chainId: 4,
      },
    }),
  };
});

jest.mock('@walletconnect/client', () => {
  return function () {
    return {
      peerMeta: {
        name: 'Test name',
        description: 'Test description',
        icons: ['https://cowswap.exchange/./favicon.png'],
        url: 'https://test.dapp.example',
      },
      on: jest.fn(),
      killSession: jest.fn(),
    };
  };
});

describe('WalletConnect unit tests', () => {
  it('Renders Wallet Connect Safe App', () => {
    renderWithProviders(<App />);

    const titleNode = screen.getByText('Wallet Connect');

    expect(titleNode).toBeInTheDocument();

    const inputNode = screen.getByPlaceholderText('Paste WalletConnect QR or connection URI');
    expect(inputNode).toBeInTheDocument();

    const instructionsNode = screen.getByText('How to connect to a Dapp');

    expect(instructionsNode).toBeInTheDocument();
  });

  describe('URI connection', () => {
    it('Connects via onPaste valid URI', () => {
      renderWithProviders(<App />);

      const instructionsNode = screen.getByText('How to connect to a Dapp');

      expect(instructionsNode).toBeInTheDocument();

      const inputNode = screen.getByPlaceholderText('Paste WalletConnect QR or connection URI');

      const URIPasteEvent = {
        clipboardData: {
          items: [
            {
              kind: 'string',
              type: 'text/plain',
            },
          ],
          getData: () =>
            'wc:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx@1?bridge=wss://safe-walletconnect.gnosis.io&key=xxxxxxxxxxx',
        },
      };

      const pasteEvent = createEvent.paste(inputNode, URIPasteEvent);

      fireEvent(inputNode, pasteEvent);

      expect(instructionsNode).not.toBeInTheDocument();

      const connectedNode = screen.getByText('Connected');
      expect(connectedNode).toBeInTheDocument();

      const connectedInstructionsNode = screen.getByText('How to confirm transactions');
      expect(connectedInstructionsNode).toBeInTheDocument();

      const dappNameNode = screen.getByText('Test name');
      expect(dappNameNode).toBeInTheDocument();

      const dappImgNode = screen.getByRole('img');
      expect(dappImgNode).toBeInTheDocument();
      expect(dappImgNode).toHaveStyle("background-image: url('https://cowswap.exchange/./favicon.png')");
    });

    it('No connection is set if an invalid URI is provided', () => {
      renderWithProviders(<App />);

      const instructionsNode = screen.getByText('How to connect to a Dapp');

      expect(instructionsNode).toBeInTheDocument();

      const inputNode = screen.getByPlaceholderText('Paste WalletConnect QR or connection URI');

      const URIPasteEvent = {
        clipboardData: {
          items: [
            {
              kind: 'string',
              type: 'text/plain',
            },
          ],
          getData: () => 'Invalid URI',
        },
      };

      const pasteEvent = createEvent.paste(inputNode, URIPasteEvent);

      fireEvent(inputNode, pasteEvent);

      const connectedNode = screen.queryByText('Connected');
      expect(connectedNode).not.toBeInTheDocument();
    });
  });

  // describe('Scan QR code connection', () => {
  //   it('Connects via webcam a valid QR code', async () => {
  //     renderWithProviders(<App />);

  //     // TODO: connect with QR scan code

  //     // const openDialogNode = screen.getByRole('button');
  //   });
  // });

  describe('Disconnect WC', () => {
    it('Disconnects if user clicks on Disconnect button', () => {
      renderWithProviders(<App />);

      const instructionsNode = screen.getByText('How to connect to a Dapp');

      expect(instructionsNode).toBeInTheDocument();

      const inputNode = screen.getByPlaceholderText('Paste WalletConnect QR or connection URI');

      const URIPasteEvent = {
        clipboardData: {
          items: [
            {
              kind: 'string',
              type: 'text/plain',
            },
          ],
          getData: () =>
            'wc:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx@1?bridge=wss://safe-walletconnect.gnosis.io&key=xxxxxxxxxxx',
        },
      };

      const pasteEvent = createEvent.paste(inputNode, URIPasteEvent);

      fireEvent(inputNode, pasteEvent);

      const disconnectButtonNode = screen.getByText('Disconnect');
      expect(disconnectButtonNode).toBeInTheDocument();

      fireEvent.click(disconnectButtonNode);

      waitFor(() => {
        expect(inputNode).toBeInTheDocument();
        expect(instructionsNode).toBeInTheDocument();
      });
    });
  });
});
