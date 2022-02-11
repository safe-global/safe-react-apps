import MuiAppBar from '@material-ui/core/AppBar';
import styled from 'styled-components';
import { Icon, Link, Text } from '@gnosis.pm/safe-react-components';

const WALLET_CONNECT_HELP = 'https://help.gnosis-safe.io/en/articles/4356253-walletconnect-safe-app';

const AppBar = () => {
  return (
    <StyledAppBar position="static" color="default" elevation={1}>
      <StyledText size="xl">Wallet Connect</StyledText>
      <Link href={WALLET_CONNECT_HELP} target="_blank">
        <Icon size="md" type="info" />
      </Link>
    </StyledAppBar>
  );
};

const StyledAppBar = styled(MuiAppBar)`
  && {
    background: #fff;
    height: 70px;
    align-items: center;
    justify-content: flex-start;
    flex-direction: row;
  }
`;

const StyledText = styled(Text)`
  font-size: 20px;
  margin-left: 38px;
  margin-right: 16px;
`;

export default AppBar;
