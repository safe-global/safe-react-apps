import styled from 'styled-components'
import Grid from '@material-ui/core/Grid'
import { Icon, Text, Button, Link } from '@gnosis.pm/safe-react-components'

import { StyledBoldText, StyledCardContainer, StyledImage } from './styles'
import { useWalletConnectType } from '../hooks/useWalletConnect'

type ConnectingProps = {
  wcSessionData: useWalletConnectType['wcSessionData']
  onOpenSafeApp: () => void
  onKeepUsingWalletConnect: () => void
}

const Connecting = ({
  wcSessionData,
  onOpenSafeApp,
  onKeepUsingWalletConnect,
}: ConnectingProps) => {
  if (!wcSessionData) {
    return null
  }

  return (
    <StyledCardContainer
      container
      direction="column"
      alignItems="center"
      justifyContent="center"
      spacing={2}
    >
      <Grid item>
        <StyledIcon size="md" type="apps" color="primary" />
      </Grid>

      <Grid item>
        <Text size="xl">
          Trying to connect <StyledBoldText as="span">{wcSessionData.name}</StyledBoldText>
        </Text>
      </Grid>

      <Grid item>
        <StyledCenteredText size="md">
          For a better experience use a Safe optimised app. It allows you to operate an app without
          interruption.
        </StyledCenteredText>
      </Grid>

      <StyledSafeAppContainer
        container
        item
        alignItems="center"
        justifyContent="center"
        spacing={3}
      >
        <Grid item xs={2}>
          <StyledImage src={wcSessionData.icons[0]} role="img" />
        </Grid>
        <Grid container direction="column" item xs={10} spacing={1}>
          <Grid item>
            <StyledBoldText size="sm" color="primary">
              SAFE OPTIMISED
            </StyledBoldText>
          </Grid>
          <Grid item>
            <Text size="lg">{wcSessionData.name || new URL(wcSessionData.url).hostname}</Text>
          </Grid>
        </Grid>
      </StyledSafeAppContainer>

      <Grid item>
        <Button size="md" color="primary" variant="contained" onClick={onOpenSafeApp}>
          Open Dapp
        </Button>
      </Grid>

      <Grid item>
        <StyledLink onClick={onKeepUsingWalletConnect}>Keep using WalletConnect</StyledLink>
      </Grid>
    </StyledCardContainer>
  )
}

const StyledSafeAppContainer = styled(Grid)`
  && {
    background-color: #eaf7f4;
    border-radius: 8px;
    margin-top: 16px;
    margin-bottom: 16px;
  }
`

const StyledCenteredText = styled(Text)`
  text-align: center;
`

const StyledLink = styled(Link)`
  text-decoration: none;
  font-weight: bold;
  font-size: 0.8em;
`

const StyledIcon = styled(Icon)`
  svg {
    width: 48px;
    height: 48px;
  }
`
export default Connecting
