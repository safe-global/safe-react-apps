import React, { useState, useEffect, useCallback } from 'react';

import styled from 'styled-components';

import { Card } from '@gnosis.pm/safe-react-components';
import Container from '@material-ui/core/Container';

import useWalletConnect from './hooks/useWalletConnect';
import AppBar from './components/AppBar';
import Help from './components/Help';
import { Grid } from '@material-ui/core';

import Disconnected from './components/Disconnected';
import Connected from './components/Connected';
import { useApps } from './hooks/useApps';
import Connecting from './components/Connecting';
import WalletConnectField from './components/WalletConnectField';
import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk';

enum CONNECTION_STATUS {
  CONNECTED,
  DISCONNECTED,
  CONNECTING,
}

const App = () => {
  const { wcClientData, wcConnect, wcDisconnect } = useWalletConnect();
  const { findSafeApp, openSafeApp } = useApps();
  const { safe } = useSafeAppsSDK();
  console.log('safe', safe);
  const [connectionStatus, setConnectionStatus] = useState(CONNECTION_STATUS.DISCONNECTED);

  const handleOpenSafeApp = (url: string) => {
    openSafeApp(url);
    wcDisconnect();
    setConnectionStatus(CONNECTION_STATUS.DISCONNECTED);
  };

  const disconnectOnPageRefresh = useCallback(() => {
    if (connectionStatus === CONNECTION_STATUS.CONNECTING) {
      wcDisconnect();
      setConnectionStatus(CONNECTION_STATUS.DISCONNECTED);
    }
  }, [connectionStatus, wcDisconnect]);

  useEffect(() => {
    window.addEventListener('beforeunload', disconnectOnPageRefresh);
    return () => {
      window.removeEventListener('beforeunload', disconnectOnPageRefresh);
    };
  }, [disconnectOnPageRefresh]);

  useEffect(() => {
    if (wcClientData) {
      setConnectionStatus(CONNECTION_STATUS.CONNECTING);
    }
  }, [wcClientData]);

  useEffect(() => {
    if (!wcClientData) {
      setConnectionStatus(CONNECTION_STATUS.DISCONNECTED);
      return;
    }

    if (connectionStatus === CONNECTION_STATUS.CONNECTING) {
      const safeApp = findSafeApp(wcClientData.url);
      console.log(safeApp);
      if (!safeApp) {
        setConnectionStatus(CONNECTION_STATUS.CONNECTED);
      }
    }
  }, [connectionStatus, findSafeApp, wcClientData]);

  return (
    <>
      <AppBar />
      <StyledContainer>
        <Grid container direction="column" alignItems="center" style={{ height: '100%', paddingTop: '45px' }}>
          <Grid item style={{ width: '484px', marginTop: '45px' }}>
            <StyledCard>
              {connectionStatus === CONNECTION_STATUS.DISCONNECTED && (
                <Disconnected>
                  <WalletConnectField client={wcClientData} onConnect={(data) => wcConnect(data)} />
                </Disconnected>
              )}
              {connectionStatus === CONNECTION_STATUS.CONNECTING && (
                <Connecting
                  client={wcClientData}
                  onOpenSafeApp={() => handleOpenSafeApp(wcClientData?.url || '')}
                  onKeepUsingWalletConnect={() => setConnectionStatus(CONNECTION_STATUS.CONNECTED)}
                />
              )}
              {connectionStatus === CONNECTION_STATUS.CONNECTED && (
                <Connected
                  client={wcClientData}
                  onDisconnect={() => {
                    setConnectionStatus(CONNECTION_STATUS.DISCONNECTED);
                    wcDisconnect();
                  }}
                />
              )}
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
