import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Grid, Container } from '@material-ui/core'
import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk'
import { Button, Card, Text } from '@gnosis.pm/safe-react-components'
import { getRefreshToken } from './lib/http'
import { authenticate, sign } from './lib/mmi'

import AppBar from './components/AppBar'
import Help from './components/Help'
import { ethers } from 'ethers'

function App() {
  const { safe } = useSafeAppsSDK()
  const [isMMISupported, setMMISupported] = useState(false)
  const [isWrongOwner, setWrongOwner] = useState(false)
  const [error, setError] = useState(null)

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
    if (!isMMISupported) {
      window.ethereum.enable() //TODO: Remove when current Metamask is rebased in MMI
    }
  }, [isMMISupported])

  const handleLogin = async () => {
    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      })
      const connectedOwner = safe.owners.find(
        owner => ethers.utils.getAddress(owner) === ethers.utils.getAddress(accounts[0]),
      )

      if (!connectedOwner) {
        setWrongOwner(true)
        return
      }

      const signature = await sign(connectedOwner)
      const refreshToken = await getRefreshToken(connectedOwner, signature)

      await authenticate(refreshToken)

      setError(null)
    } catch (error: any) {
      setError(error.message)
      console.error(error)
    }
  }

  const hasError = !isMMISupported || safe.isReadOnly || isWrongOwner

  return (
    <main>
      <AppBar />
      <StyledMainContainer as="main">
        <StyledAppContainer container direction="column" alignItems="center">
          <StyledCardContainer item>
            <StyledCard>
              <StyledContainer container alignItems="center" justifyContent="center" spacing={3}>
                <Grid item>
                  <StyledLogo src="./mmi.svg" alt="safe-app-logo" />
                </Grid>
                <Grid container item justifyContent="center" alignItems="center">
                  <StyledText size="xl">
                    Setup your Safe account with Metamask Institutional
                  </StyledText>
                  {!hasError ? (
                    <>
                      <Button
                        size="md"
                        id="connect"
                        onClick={handleLogin}
                        style={{ marginTop: '16px' }}
                      >
                        Start
                      </Button>
                      <StyledErrorContainer>
                        {error && (
                          <Text size="lg" color="error">
                            {error}
                          </Text>
                        )}
                      </StyledErrorContainer>
                    </>
                  ) : (
                    <StyledErrorContainer>
                      {!isMMISupported ? (
                        <Text size="lg" color="error">
                          MMI is not supported. Install MetaMask Institutional
                        </Text>
                      ) : (
                        <>
                          {safe.isReadOnly && (
                            <Text size="lg" color="error">
                              You are not an owner of this safe
                            </Text>
                          )}
                          {isWrongOwner && (
                            <Text size="lg" color="error">
                              You are connected with the wrong owner
                            </Text>
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
      </StyledMainContainer>
    </main>
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

const StyledText = styled(Text)`
  text-align: center;
  margin-bottom: 8px;
`

const StyledLogo = styled.img`
  width: 64px;
  height: 64px;
`

const StyledErrorContainer = styled.div`
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
