import React, { useState, useEffect } from 'react';
import jsQr from 'jsqr';
import styled from 'styled-components';
import format from 'date-fns/format';

import { TextFieldInput, Button, Text, Title, Icon, Loader, Card } from '@gnosis.pm/safe-react-components';
import Dialog from '@material-ui/core/Dialog';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Container from '@material-ui/core/Container';

import { blobToImageData } from './utils/images';
import { Wrapper } from './components/layout';
import WCClientInfo from './components/WCClientInfo';
import useWalletConnect from './hooks/useWalletConnect';
import ScanCode from './components/ScanCode';
import AppBar from './components/AppBar';
import Help from './components/Help';
import { Grid } from '@material-ui/core';

const App = () => {
  const { wcClientData, wcConnect, wcDisconnect } = useWalletConnect();
  const [inputValue, setInputValue] = useState('');
  const [invalidQRCode, setInvalidQRCode] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const handleQRDialogClose = () => {
    setOpenDialog(false);
  };

  useEffect(() => {
    if (wcClientData) {
      setOpenDialog(false);
    }
  }, [wcClientData]);

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

  const getDisconnectedContent = () => {
    if (isConnecting) {
      return <Loader size="md" />;
    }
    return (
      <StyledTextField
        id="wc-uri"
        name="wc-uri"
        label="Paste WalletConnect QR code or connection URI"
        hiddenLabel={false}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onPaste={onPaste}
        autoComplete="off"
        error={invalidQRCode ? 'Invalid QR code' : ''}
        showErrorsInTheLabel={false}
        InputProps={{
          endAdornment: (
            <StyledQRCodeAdorment position="end">
              <Tooltip title="Show scan QR code dialog" aria-label="Show scan QR code dialog">
                <IconButton onClick={() => setOpenDialog((open) => !open)}>
                  <Icon size="md" type="qrCode" />
                </IconButton>
              </Tooltip>
            </StyledQRCodeAdorment>
          ),
        }}
      />
    );
  };

  const getConnectedContent = () => (
    <>
      <WCClientInfo name={wcClientData!.name} url={wcClientData!.url} iconSrc={wcClientData!.icons[0]} />

      <Button size="md" color="primary" variant="contained" onClick={() => wcDisconnect()}>
        Disconnect
      </Button>
    </>
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
          <Grid item style={{ width: '50%', marginTop: '45px' }}>
            <Card>
              {/* WalletConnect */}
              {wcClientData && (
                <StyledWrapper>
                  <Text color="white" size="xl">
                    You need to have this WalletConnect Safe app open for transactions to pop up.
                  </Text>
                  <Text color="white" size="xl">
                    You will not receive transaction requests when you don't have it open.
                  </Text>
                </StyledWrapper>
              )}
              <Wrapper>
                <WCContent>
                  <StyledTitle size="sm">Wallet Connect</StyledTitle>
                  {wcClientData ? getConnectedContent() : getDisconnectedContent()}
                </WCContent>
              </Wrapper>
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
            </Card>
          </Grid>
          <Grid item style={{ width: '50%', marginTop: '16px' }}>
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

const StyledTitle = styled(Title)`
  margin-top: 0;
`;

const StyledContainer = styled(Container)`
  && {
    background-color: #e5e5e5;
    display: flex;
    height: calc(100% - 70px);
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
`;

const StyledText = styled(Text)`
  margin-bottom: 8px;
`;

const StyledWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  background: #008c73;
  padding: 18px 0 12px 0;
  border-radius: 8px;
`;

const StyledHelpLink = styled.div`
  display: flex;

  > :first-of-type {
    margin-right: 5px;
  }
`;

const WCContent = styled.div`
  min-width: 430px;
  margin-right: 20px;
`;

const StyledTextField = styled(TextFieldInput)`
  && {
    width: 430px;
    .MuiInputLabel-filled {
      color: #0000008a;
    }

    .MuiInputLabel-shrink {
      color: #008c73;
    }
  }
`;

const StyledQRCodeAdorment = styled(InputAdornment)`
  cursor: pointer;
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
