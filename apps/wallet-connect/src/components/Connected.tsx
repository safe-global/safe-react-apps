import Grid from '@material-ui/core/Grid'
import styled from 'styled-components'
import { Text, Icon, Button, Divider } from '@gnosis.pm/safe-react-components'

import { StyledCardContainer, StyledImage } from './styles'
import { useWalletConnectType } from '../hooks/useWalletConnect'

type ConnectedProps = {
  wcClientData: useWalletConnectType['wcClientData']
  onDisconnect: () => void
}

const Connected = ({ wcClientData, onDisconnect }: ConnectedProps) => {
  if (!wcClientData) {
    return null
  }

  return (
    <StyledCardContainer container direction="column" spacing={3}>
      <Grid container alignItems="center" wrap="nowrap" spacing={3}>
        <Grid item>
          <StyledImage src={wcClientData.icons[0] || ''} role="img" />
        </Grid>
        <Grid item>
          <StyledText size="md" color="primary">
            CONNECTED
          </StyledText>
          <Text size="xl" as="span">
            {wcClientData.name || new URL(wcClientData.url).hostname}
          </Text>
        </Grid>
      </Grid>

      <Grid item>
        <StyledDivider />
      </Grid>

      <StyledCenteredGridItem item>
        <Button size="md" color="error" variant="contained" onClick={onDisconnect}>
          Disconnect
        </Button>
      </StyledCenteredGridItem>

      <Grid item>
        <StyledMessage>
          <Icon type="info" color="primary" size="md" />
          <Text size="lg">
            You need to have this WalletConnect Safe app open for transactions to pop up. You will
            not receive transaction requests when you don't have it open.
          </Text>
        </StyledMessage>
      </Grid>
    </StyledCardContainer>
  )
}

const StyledText = styled(Text)`
  letter-spacing: 1px;
  font-weight: bold;
  margin-bottom: 5px;
`

const StyledCenteredGridItem = styled(Grid)`
  align-self: center;
`

const StyledDivider = styled(Divider)`
  margin: 0 8px 0 0;
`

const StyledMessage = styled.div`
  padding: 20px;
  background: #effaf8;
  text-align: center;
  border-radius: 8px;

  p {
    margin-top: 8px;
    text-align: center;
    line-height: 22px;
  }
`

export default Connected
