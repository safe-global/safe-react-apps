import styled from 'styled-components';
import { IClientMeta } from '@walletconnect/types';
import Grid from '@material-ui/core/Grid';
import { Text, Button, Link } from '@gnosis.pm/safe-react-components';
import { ReactComponent as SafeAppConnectLogo } from '../assets/safe-app-connect.svg';
import { StyledBoldText, StyledCardContainer, StyledImage } from './styles';

type ConnectingProps = {
  client: IClientMeta | null;
  onOpenSafeApp: () => void;
  onKeepUsingWalletConnect: () => void;
};

const Connecting = ({ client, onOpenSafeApp, onKeepUsingWalletConnect }: ConnectingProps) => {
  if (!client) {
    return null;
  }

  return (
    <StyledCardContainer container direction="column" alignItems="center" justifyContent="center" spacing={2}>
      <Grid item>
        <SafeAppConnectLogo />
      </Grid>

      <Grid item>
        <Text size="xl">
          Trying to connect <StyledBoldText as="span">{client.name}</StyledBoldText>
        </Text>
      </Grid>

      <Grid item>
        <StyledCenteredText size="md">
          For better experience use Safe optimised app. It allows you to operate with an app without interruption.
        </StyledCenteredText>
      </Grid>

      <StyledSafeAppContainer container item alignItems="center" justifyContent="center" spacing={3}>
        <Grid item xs={2}>
          <StyledImage src={client.icons[0]} role="img" />
        </Grid>
        <Grid container direction="column" item xs={10} spacing={1}>
          <Grid item>
            <StyledBoldText size="sm" color="primary">
              SAFE OPTIMISED
            </StyledBoldText>
          </Grid>
          <Grid item>
            <Text size="lg">{client.name ? client.name : new URL(client.url).hostname}</Text>
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
  );
};

const StyledSafeAppContainer = styled(Grid)`
  && {
    background-color: #eaf7f4;
    border-radius: 8px;
    margin-top: 16px;
    margin-bottom: 16px;
  }
`;

const StyledCenteredText = styled(Text)`
  text-align: center;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  font-weight: bold;
  font-size: 0.8em;
`;

export default Connecting;
