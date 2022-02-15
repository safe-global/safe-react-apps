import styled from 'styled-components';
import { IClientMeta } from '@walletconnect/types';
import Grid from '@material-ui/core/Grid';
import { Button, Link } from '@gnosis.pm/safe-react-components';
import { Text } from '@gnosis.pm/safe-react-components';
import { ReactComponent as SafeAppConnectLogo } from '../assets/safe-app-connect.svg';

type ConnectSafeAppProps = {
  client: IClientMeta | null;
  onOpenSafeApp: () => void;
  onKeepUsingWalletConnect: () => void;
};

const ConnectSafeApp = ({ client, onOpenSafeApp, onKeepUsingWalletConnect }: ConnectSafeAppProps) => {
  if (!client) {
    return null;
  }

  return (
    <Container container direction="column" alignItems="center" justifyContent="center" spacing={2}>
      <Grid item>
        <SafeAppConnectLogo />
      </Grid>

      <Grid item>
        <Text size="xl">
          Trying to connect <Bold>{client.name}</Bold>
        </Text>
      </Grid>

      <Grid item>
        <CenteredText size="md">
          For better experience use Safe optimised app. It allows you to operate with an app without interruption.
        </CenteredText>
      </Grid>

      <SafeApp container item alignItems="center" justifyContent="center" spacing={3}>
        <Grid item xs={2}>
          <Image src={client.icons[0]} role="img" />
        </Grid>
        <Grid container direction="column" item xs={10} spacing={1}>
          <Grid item>
            <AppTitle size="sm" color="primary">
              <Bold>SAFE OPTIMISED</Bold>
            </AppTitle>
          </Grid>
          <Grid item>
            <Text size="lg">{client.name}</Text>
          </Grid>
        </Grid>
      </SafeApp>

      <Grid item>
        <Button size="md" color="primary" variant="contained" onClick={onOpenSafeApp}>
          Open Dapp
        </Button>
      </Grid>

      <Grid item>
        <StyledLink onClick={onKeepUsingWalletConnect}>Keep using WalletConnect</StyledLink>
      </Grid>
    </Container>
  );
};

const SafeApp = styled(Grid)`
  && {
    background-color: #eaf7f4;
    border-radius: 8px;
    margin-top: 16px;
    margin-bottom: 16px;
  }
`;

const Container = styled(Grid)`
  padding: 16px 22px;
`;

const AppTitle = styled(Text)`
  letter-spacing: 1px;
  font-weight: bold;
`;

const Image = styled.div<{ src: string }>`
  background: url('${({ src }) => src}') no-repeat center;
  height: 60px;
  width: 60px;
  background-size: contain;
`;

const Bold = styled.span`
  font-weight: bold;
`;

const CenteredText = styled(Text)`
  text-align: center;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  font-weight: bold;
  font-size: 0.8em;
`;

export default ConnectSafeApp;
