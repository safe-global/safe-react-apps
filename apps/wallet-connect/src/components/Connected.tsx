import styled from 'styled-components';
import { IClientMeta } from '@walletconnect/types';
import Grid from '@material-ui/core/Grid';
import { Button, Divider } from '@gnosis.pm/safe-react-components';
import { Text, Icon } from '@gnosis.pm/safe-react-components';

type ConnectedProps = {
  client: IClientMeta | null;
  onDisconnect: () => void;
};

const Connected = ({ client, onDisconnect }: ConnectedProps) => {
  if (!client) {
    return null;
  }

  return (
    <Container container direction="column" spacing={3}>
      <Grid container alignItems="center" spacing={3}>
        <Grid item>
          <Image src={client.icons[0] || ''} role="img" />
        </Grid>
        <Grid item>
          <Text size="md" color="primary">
            CONNECTED
          </Text>
          <Text size="xl" as="span" strong>
            {client.name ? client.name : new URL(client.url).hostname}
          </Text>
        </Grid>
      </Grid>

      <Grid item>
        <StyledDivider />
      </Grid>

      <Grid item>
        <Button size="md" color="error" variant="contained" onClick={onDisconnect}>
          Disconnect
        </Button>
      </Grid>

      <StyledMessage item direction="column" alignItems="center" justifyContent="center" spacing={4}>
        <Icon type="info" color="primary" size="md" />
        <Text size="lg">
          You need to have this WalletConnect Safe app open for transactions to pop up. You will not receive transaction
          requests when you don't have it open.
        </Text>
      </StyledMessage>
    </Container>
  );
};

const Image = styled.div<{ src: string }>`
  background: url('${({ src }) => src}') no-repeat center;
  height: 60px;
  width: 60px;
  background-size: contain;
`;

const StyledDivider = styled(Divider)`
  margin: 0 8px 0 0;
`;

const Container = styled(Grid)`
  padding: 16px 22px;
`;

const StyledMessage = styled(Grid)`
  padding: 20px;
  background: #effaf8;
  text-align: center;
  border-radius: 8px;

  p {
    margin-top: 8px;
    text-align: center;
    line-height: 20px;
  }
`;

export default Connected;
