import MuiAppBar from '@material-ui/core/AppBar'
import styled from 'styled-components'
import { Icon, Link, Text } from '@gnosis.pm/safe-react-components'

const WALLET_CONNECT_HELP = 'https://help.safe.global/en/articles/40849-walletconnect-safe-app'

const AppBar = () => {
  return (
    <StyledAppBar position="static" color="default">
      <StyledAppBarText size="xl">Wallet Connect</StyledAppBarText>
      <Link href={WALLET_CONNECT_HELP} target="_blank">
        <Icon size="md" type="info" />
      </Link>
    </StyledAppBar>
  )
}

const StyledAppBar = styled(MuiAppBar)`
  && {
    background: #fff;
    height: 70px;
    align-items: center;
    justify-content: flex-start;
    flex-direction: row;
    border-bottom: 2px solid #e8e7e6;
  }
`

const StyledAppBarText = styled(Text)`
  font-size: 20px;
  margin-left: 38px;
  margin-right: 16px;
`

export default AppBar
