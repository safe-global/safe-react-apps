import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { useSafeAppsSDK } from '@safe-global/safe-apps-react-sdk'
import { hashMessage } from 'ethers/lib/utils'
import { Grid, Container, Button, Typography, Card, styled } from '@mui/material'
import AppBar from './components/AppBar'
import Help from './components/Help'

import { getRefreshToken } from './lib/http'
import { authenticate, sign } from './lib/mmi'
import { truncateEthAddress } from './lib/utils'

const getConnectedOwner = (safeOwners: string[], accounts: string[]) =>
  safeOwners.find(owner => ethers.utils.getAddress(owner) === ethers.utils.getAddress(accounts[0]))

function App() {
  const { safe, sdk } = useSafeAppsSDK()
  const [isMMISupported, setMMISupported] = useState(false)
  const [isWrongOwner, setWrongOwner] = useState(false)
  const [isReadOnly, setIsReadOnly] = useState(false)
  const [error, setError] = useState(null)
  const [accounts, setAccounts] = useState([])

  useEffect(() => {
    ;(async () => {
      try {
        let result = await window.ethereum.request({
          method: 'metamaskinstitutional_supported',
        })
        setMMISupported(!!result)
      } catch (error) {
        console.error(error)
      }
    })()
  }, [])

  useEffect(() => {
    ;(async () => {
      const acc = await window.ethereum.request({
        method: 'eth_requestAccounts',
      })
      setAccounts(acc)
    })()

    window.ethereum.on('accountsChanged', (acc: any) => {
      setAccounts(acc)
    })

    return () => {
      window.ethereum.removeAllListeners('accountsChanged')
    }
  }, [])

  useEffect(() => {
    if (!isMMISupported) {
      window.ethereum.enable() //TODO: Remove when current Metamask is rebased in MMI
    }
  }, [isMMISupported])

  const handleLogin = async () => {
    setError(null)
    setIsReadOnly(false)
    setWrongOwner(false)

    try {
      const safeInfo = await sdk.safe.getInfo()

      // Verify the Safe is connected with any of its owners
      if (safeInfo.isReadOnly) {
        setIsReadOnly(true)
        return
      }

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      })

      const connectedOwner = getConnectedOwner(safe.owners, accounts)

      // Verify the connected owner and the extension owner are the same
      if (!connectedOwner) {
        setWrongOwner(true)
        return
      }

      const message = `Safe-mmi-auth - ${Math.floor(Math.round(new Date().getTime() / 1000) / 300)}`
      const signature = await sign(connectedOwner, message)

      // Verify signature
      if (ethers.utils.recoverAddress(hashMessage(message), signature) === connectedOwner) {
        const refreshToken = await getRefreshToken(connectedOwner, signature)
        await authenticate(refreshToken)
      } else {
        setWrongOwner(true)
      }

      setError(null)
    } catch (error: any) {
      setError(error.message)
      console.error(error)
    }
  }

  const hasError = !isMMISupported || isReadOnly || isWrongOwner

  return (
    <StyledMainContainer as="main">
      <AppBar account={accounts[0]} />
      <>
        <StyledAppContainer container direction="column" alignItems="center">
          <StyledCardContainer item>
            <StyledCard>
              <StyledContainer container alignItems="center" justifyContent="center" spacing={3}>
                <Grid item>
                  <StyledLogo src={`${process.env.PUBLIC_URL}/mmi.svg`} alt="safe-app-logo" />
                </Grid>
                <Grid
                  container
                  item
                  justifyContent="center"
                  alignItems="center"
                  flexDirection="column"
                >
                  <StyledText>Setup your Safe account with Metamask Institutional</StyledText>
                  <Button
                    id="connect"
                    variant="contained"
                    size="medium"
                    onClick={handleLogin}
                    sx={{ minWidth: '150px', mt: 2 }}
                  >
                    Start
                  </Button>
                  {!hasError ? (
                    <>
                      <StyledErrorContainer>
                        {error && (
                          <Typography color="error" variant="body1">
                            {error}
                          </Typography>
                        )}
                      </StyledErrorContainer>
                    </>
                  ) : (
                    <StyledErrorContainer>
                      {!isMMISupported ? (
                        <Typography color="error" variant="body1">
                          MMI is not supported. Install MetaMask Institutional
                        </Typography>
                      ) : (
                        <>
                          {isReadOnly && (
                            <Typography color="error" variant="body1">
                              You are not an owner of this safe
                            </Typography>
                          )}
                          {isWrongOwner && (
                            <Typography color="error" variant="body1" textAlign="center">
                              The Safe App connected account ({truncateEthAddress(accounts[0])}) is
                              not an owner of the connected Safe (
                              {truncateEthAddress(safe.safeAddress)})
                            </Typography>
                          )}
                        </>
                      )}
                    </StyledErrorContainer>
                  )}
                </Grid>
              </StyledContainer>
            </StyledCard>
          </StyledCardContainer>
          <StyledHelpContainer item>
            <Help title={HELP_CONNECT.title} steps={HELP_CONNECT.steps} />
          </StyledHelpContainer>
        </StyledAppContainer>
      </>
    </StyledMainContainer>
  )
}

const StyledMainContainer = styled(Container)`
  && {
    height: 100%;
    max-width: 100%;
    display: flex;
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
  width: 524px;
  margin-top: 45px;
`

const StyledHelpContainer = styled(Grid)`
  && {
    width: 524px;
    margin-top: 16px;
  }
`

const StyledCard = styled(Card)`
  && {
    box-shadow: none;
  }
`

const StyledContainer = styled(Grid)`
  padding: 38px 30px 45px 30px;
`

const StyledText = styled(Typography)`
  text-align: center;
  margin-bottom: 8px;
`

const StyledLogo = styled('img')`
  width: 64px;
  height: 64px;
`

const StyledErrorContainer = styled('div')`
  margin-top: 20px;
`

const HELP_CONNECT = {
  title: 'How to setup your Safe with Metamask Institutional',
  steps: [
    'Install MetaMask Institutional',
    'Add at least one of the owners of the Safe as a Metamask Institutional account',
    'Connect your Metamask Institutional owner to the Safe UI',
    'Click the Start button (You must be an owner of the current Safe)',
    'Sign the message',
    'Confirm the custodian account',
    'Select the Safes you want to setup and press the Connect button on the Metamask UI',
    'You should see a message indicating the selected addresses have been added',
    'Now you can use your Safe from the Metamask Institutional UI',
  ],
}

export default App
