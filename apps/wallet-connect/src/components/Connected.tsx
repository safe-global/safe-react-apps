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
    <>
      <Grid container item alignItems="center" spacing={3}>
        <Image src={client.icons[0] || ''} role="img" />
        <Grid item>
          <Text size="md" color="primary">
            CONNECTED
          </Text>
          <Text size="xl" as="span" strong>
            {client.name}
          </Text>
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <StyledDivider />
        <Button size="md" color="error" variant="contained" onClick={onDisconnect}>
          Disconnect
        </Button>
      </Grid>

      <StyledMessage>
        <Icon type="info" color="primary" size="md" />
        <Text size="md">
          You need to have this WalletConnect Safe app open for transactions to pop up. You will not receive transaction
          requests when you don't have it open.
        </Text>
      </StyledMessage>
    </>
  );
};

const Image = styled.div<{ src: string }>`
  background: url('${({ src }) => src}') no-repeat center;
  height: 60px;
  width: 60px;
  background-size: contain;
`;

const StyledMessage = styled(Grid)`
  margin-top: 16px;
  background: #effaf8;
  padding: 16px;
  text-align: center;

  p {
    text-align: center;
    line-height: 16px;
  }
`;

const StyledDivider = styled(Divider)`
  margin-top: 16px;
`;

export default Connected;
