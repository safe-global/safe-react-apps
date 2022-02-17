import { Text } from '@gnosis.pm/safe-react-components';
import Grid from '@material-ui/core/Grid';
import React from 'react';
import styled from 'styled-components';
import { ReactComponent as WalletConnectLogo } from '../assets/wallet-connect-logo.svg';

const Disconnected: React.FC = ({ children }) => {
  return (
    <Container container alignItems="center" justifyContent="center" spacing={3}>
      <Grid item>
        <WalletConnectLogo />
      </Grid>
      <Grid item>
        <StyledText size="xl">Connect your Safe to a dApp via the WalletConnect and trigger transactions</StyledText>
      </Grid>
      <Grid item>{children}</Grid>
    </Container>
  );
};

const Container = styled(Grid)`
  padding: 38px 30px 45px 30px;
`;

const StyledText = styled(Text)`
  margin-bottom: 8px;
  text-align: center;
`;

export default Disconnected;
