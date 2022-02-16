import React, { useState, useEffect } from 'react';
import jsQr from 'jsqr';
import styled from 'styled-components';
import format from 'date-fns/format';

import { Icon, Card } from '@gnosis.pm/safe-react-components';
import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Container from '@material-ui/core/Container';

import { blobToImageData } from './utils/images';
import useWalletConnect from './hooks/useWalletConnect';
import ScanCode from './components/ScanCode';
import AppBar from './components/AppBar';
import Help from './components/Help';
import { Grid } from '@material-ui/core';

import Disconnected from './components/Disconnected';
import Connected from './components/Connected';
import { useApps } from './hooks/useApps';
import Connecting from './components/Connecting';
import useConnectionState, {
  DISCONNECTED_STATE,
  CONNECTING_STATE,
  CONNECTED_STATE,
  CONNECT_EVENT,
  DISCONNECT_EVENT,
} from './hooks/useConnectionState';

const App = () => {
  const { wcClientData, wcConnect, wcDisconnect } = useWalletConnect();
  const [inputValue, setInputValue] = useState('');
  const [invalidQRCode, setInvalidQRCode] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const { findSafeApp } = useApps();
  const { connectionStatus, changeConnectionStatus } = useConnectionState();

  const handleQRDialogClose = () => {
    setOpenDialog(false);
  };

  const openSafeApp = (url: string | undefined) => {
    // TODO. How can I get the safe-react URL in order to navigate to it?
    console.log(url);
    wcDisconnect();
    changeConnectionStatus(DISCONNECTED_STATE);
  };

  useEffect(() => {
    if (wcClientData) {
      setOpenDialog(false);
      changeConnectionStatus(CONNECT_EVENT);
    }
  }, [wcClientData, changeConnectionStatus]);

  useEffect(() => {
    if (!wcClientData) {
      changeConnectionStatus(DISCONNECT_EVENT);
      return;
    }

    if (connectionStatus === CONNECTING_STATE) {
      const safeApp = findSafeApp(wcClientData.url);
      console.log(safeApp);
      if (!safeApp) {
        changeConnectionStatus(CONNECT_EVENT);
      }
    }
  }, [connectionStatus, findSafeApp, wcClientData, changeConnectionStatus]);

  const onPaste = React.useCallback(
    (event: React.ClipboardEvent) => {
      const connectWithUri = (data: string) => {
        if (data.startsWith('wc:')) {
          setIsConnecting(true);
          wcConnect({ uri: data });
        }
      };

      const connectWithQR = (item: DataTransferItem) => {
        const blob = item.getAsFile();
        const reader = new FileReader();
        reader.onload = async (event: ProgressEvent<FileReader>) => {
          const imageData = await blobToImageData(event.target?.result as string);
          const code = jsQr(imageData.data, imageData.width, imageData.height);
          if (code?.data) {
            setIsConnecting(true);
            wcConnect({ uri: code.data });
          } else {
            setInvalidQRCode(true);
            setInputValue(`Screen Shot ${format(new Date(), 'yyyy-MM-dd')} at ${format(new Date(), 'hh.mm.ss')}`);
          }
        };
        reader.readAsDataURL(blob as Blob);
      };

      setInvalidQRCode(false);
      setInputValue('');

      if (wcClientData) {
        return;
      }

      const items = event.clipboardData.items;

      for (const index in items) {
        const item = items[index];

        if (item.kind === 'string' && item.type === 'text/plain') {
          connectWithUri(event.clipboardData.getData('Text'));
        }

        if (item.kind === 'file') {
          connectWithQR(item);
        }
      }
    },
    [wcClientData, wcConnect],
  );

  // WalletConnect does not provide a loading/connecting status
  // This effects simulates a connecting status, and prevents
  // the user to initiate two connections in simultaneous.
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isConnecting) {
      interval = setTimeout(() => setIsConnecting(false), 2_000);
    }
    return () => clearTimeout(interval);
  }, [isConnecting]);

  return (
    <>
      <AppBar />
      <StyledContainer>
        <Grid container direction="column" alignItems="center" style={{ height: '100%', paddingTop: '45px' }}>
          <Grid item style={{ width: '484px', marginTop: '45px' }}>
            <StyledCard>
              {connectionStatus === DISCONNECTED_STATE && (
                <Disconnected
                  isConnecting={isConnecting}
                  url={inputValue}
                  onUrlChange={(url) => setInputValue(url)}
                  onPaste={onPaste}
                  onCameraOpen={() => setOpenDialog((open) => !open)}
                  error={invalidQRCode ? 'Invalid QR code' : ''}
                />
              )}
              {connectionStatus === CONNECTING_STATE && (
                <Connecting
                  client={wcClientData}
                  onOpenSafeApp={() => openSafeApp(wcClientData?.url)}
                  onKeepUsingWalletConnect={() => changeConnectionStatus(CONNECT_EVENT)}
                />
              )}
              {connectionStatus === CONNECTED_STATE && (
                <Connected
                  client={wcClientData}
                  onDisconnect={() => {
                    changeConnectionStatus(DISCONNECT_EVENT);
                    wcDisconnect();
                  }}
                />
              )}
              <Dialog
                open={openDialog}
                onClose={handleQRDialogClose}
                aria-labelledby="Dialog to scan QR"
                aria-describedby="Dialog to load a QR code"
              >
                <CloseDialogContainer>
                  <Tooltip title="Close scan QR code dialog" aria-label="Close scan QR code dialog">
                    <IconButton onClick={handleQRDialogClose}>
                      <Icon size="md" type="cross" color="primary" />
                    </IconButton>
                  </Tooltip>
                </CloseDialogContainer>
                <ScanCode wcConnect={wcConnect} wcClientData={wcClientData} />
              </Dialog>
            </StyledCard>
          </Grid>
          <Grid item style={{ width: '484px', marginTop: '16px' }}>
            {wcClientData ? (
              <Help title={HELP_TRANSACTIONS.title} steps={HELP_TRANSACTIONS.steps} />
            ) : (
              <Help title={HELP_CONNECT.title} steps={HELP_CONNECT.steps} />
            )}
          </Grid>
        </Grid>
      </StyledContainer>
    </>
  );
};

export default App;

const StyledContainer = styled(Container)`
  && {
    max-width: 100%;
    background-color: #f3f5f6;
    display: flex;
    height: calc(100% - 70px);
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
`;

const StyledCard = styled(Card)`
  && {
    box-shadow: none;
  }
`;
const CloseDialogContainer = styled.div`
  position: absolute;
  z-index: 10;
  top: 4px;
  right: 4px;
`;

const HELP_CONNECT = {
  title: 'How to connect to a Dapp?',
  steps: [
    'Open a Dapp with WalletConnect support.',
    'Copy QR code image into clipboard (Command+Control+Shift+4 on Mac, Windows key+PrtScn on Windows).',
    'Paste QR code image into the input field (Command+V on Mac, Ctrl+V on Windows).',
    'WalletConnect connection is established automatically.',
    'Now you can trigger transactions via the Dapp to your Safe.',
  ],
};

const HELP_TRANSACTIONS = {
  title: 'How to confirm transactions?',
  steps: [
    'Trigger a transaction from the Dapp.',
    'Come back here to confirm the transaction. You will see a popup with transaction details. Review the details and submit the transaction.',
    'The transaction has to be confirmed by owners and executed just like any other Safe transaction',
  ],
};
