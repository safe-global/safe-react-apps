import MuiAppBar from '@material-ui/core/AppBar'
import styled from 'styled-components'
import { Text } from '@gnosis.pm/safe-react-components'

const AppBar = () => {
  return (
    <StyledAppBar position="static" color="default">
      <StyledAppBarText size="xl">MetaMask Institutional</StyledAppBarText>
    </StyledAppBar>
  )
}

const StyledAppBar = styled(MuiAppBar)`
  && {
    position: sticky;
    top: 0;
    background: #fff;
    height: 70px;
    align-items: center;
    justify-content: flex-start;
    flex-direction: row;
    border-bottom: 2px solid #e8e7e6;
    box-shadow: none;
  }
`

const StyledAppBarText = styled(Text)`
  font-size: 20px;
  margin-left: 38px;
  margin-right: 16px;
`

export default AppBar
