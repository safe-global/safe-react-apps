import { useState, useEffect, useCallback } from 'react'
import styled from 'styled-components'
import { Grid } from '@material-ui/core'
import Container from '@material-ui/core/Container'
import { Card, Loader, Text } from '@gnosis.pm/safe-react-components'

import useWalletConnect from './hooks/useWalletConnect'
import AppBar from './components/AppBar'
import Help from './components/Help'
import Disconnected from './components/Disconnected'
import Connected from './components/Connected'
import Connecting from './components/Connecting'
import WalletConnectField from './components/WalletConnectField'

enum CONNECTION_STATUS {
  CONNECTED,
  DISCONNECTED,
  CONNECTING,
}

const App = () => {
  const {
    wcConnect,
    wcClientData,
    wcDisconnect,
    isWallectConnectInitialized,
    error,
    openSafeApp,
    findSafeApp,
  } = useWalletConnect()

  const [connectionStatus, setConnectionStatus] = useState(CONNECTION_STATUS.DISCONNECTED)

  const handleOpenSafeApp = useCallback(
    (url: string) => {
      openSafeApp(url)
      wcDisconnect()
      setConnectionStatus(CONNECTION_STATUS.DISCONNECTED)
    },
    [openSafeApp, wcDisconnect],
  )

  useEffect(() => {
    if (wcClientData) {
      setConnectionStatus(CONNECTION_STATUS.CONNECTING)
    }
  }, [wcClientData])

  useEffect(() => {
    if (!wcClientData) {
      setConnectionStatus(CONNECTION_STATUS.DISCONNECTED)
      return
    }

    if (connectionStatus === CONNECTION_STATUS.CONNECTING) {
      const safeApp = findSafeApp(wcClientData.url)

      if (!safeApp) {
        setConnectionStatus(CONNECTION_STATUS.CONNECTED)
      }
    }
  }, [connectionStatus, findSafeApp, wcClientData])

  if (!isWallectConnectInitialized) {
    return (
      <StyledMainContainer>
        <Loader size="md" />
      </StyledMainContainer>
    )
  }

  return (
    <>
      <AppBar />
      <StyledMainContainer as="main">
        <StyledAppContainer container direction="column" alignItems="center">
          <StyledCardContainer item>
            <StyledCard>
              {connectionStatus === CONNECTION_STATUS.DISCONNECTED && (
                <Disconnected>
                  <WalletConnectField wcClientData={wcClientData} onConnect={wcConnect} />
                </Disconnected>
              )}
              {connectionStatus === CONNECTION_STATUS.CONNECTING && (
                <Connecting
                  wcClientData={wcClientData}
                  onOpenSafeApp={() => handleOpenSafeApp(wcClientData?.url || '')}
                  onKeepUsingWalletConnect={() => setConnectionStatus(CONNECTION_STATUS.CONNECTED)}
                />
              )}
              {connectionStatus === CONNECTION_STATUS.CONNECTED && (
                <Connected
                  wcClientData={wcClientData}
                  onDisconnect={() => {
                    setConnectionStatus(CONNECTION_STATUS.DISCONNECTED)
                    wcDisconnect()
                  }}
                />
              )}

              {/* error label to provide feedback to the user */}
              {error && (
                <Grid item>
                  <Text size="md" color="error" center>
                    {error}
                  </Text>
                </Grid>
              )}
            </StyledCard>
          </StyledCardContainer>
          <StyledHelpContainer item>
            {connectionStatus === CONNECTION_STATUS.DISCONNECTED && (
              <Help title={HELP_CONNECT.title} steps={HELP_CONNECT.steps} />
            )}
            {connectionStatus !== CONNECTION_STATUS.DISCONNECTED && (
              <Help title={HELP_TRANSACTIONS.title} steps={HELP_TRANSACTIONS.steps} />
            )}
          </StyledHelpContainer>
        </StyledAppContainer>
      </StyledMainContainer>
    </>
  )
}

const StyledMainContainer = styled(Container)`
  && {
    max-width: 100%;
    background-color: #f3f5f6;
    display: flex;
    height: calc(100% - 70px);
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
`

const StyledAppContainer = styled(Grid)`
  height: 100%;
  padding-top: 45px;
`

const StyledCardContainer = styled(Grid)`
  width: 484px;
  margin-top: 45px;
`

const StyledHelpContainer = styled(Grid)`
  && {
    width: 484px;
    margin-top: 16px;
  }
`

const StyledCard = styled(Card)`
  && {
    box-shadow: none;
  }
`

export default App

const HELP_CONNECT = {
  title: 'How to connect to a Dapp?',
  steps: [
    'Open a Dapp with WalletConnect support.',
    'Copy the QR code image into clipboard (Command+Control+Shift+4 on Mac, Windows key+PrtScn on Windows) or copy the link.',
    'Paste the QR code image or link into the input field (Command+V on Mac, Ctrl+V on Windows).',
    'WalletConnect connection is established automatically.',
    'Now you can trigger transactions via the Dapp to your Safe.',
  ],
}

const HELP_TRANSACTIONS = {
  title: 'How to confirm transactions?',
  steps: [
    'Trigger a transaction from the Dapp.',
    'Come back here to confirm the transaction. You will see a popup with transaction details. Review the details and submit the transaction.',
    'The transaction has to be confirmed by owners and executed just like any other Safe transaction.',
  ],
}
