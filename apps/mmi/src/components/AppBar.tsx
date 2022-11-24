import { Box } from '@material-ui/core'
import { AppBar as MuiAppBar, Typography, styled } from '@mui/material'
import { truncateEthAddress } from '../lib/utils'

const AppBar = ({ account }: { account: string }) => {
  return (
    <StyledAppBar position="static" color="default">
      <Typography variant="h6" pl={4}>
        MetaMask Institutional
      </Typography>
      <Box display="flex">
        <Typography pr={1}>MMI Account: </Typography>
        <Typography pr={4} fontWeight={700}>
          {truncateEthAddress(account)}
        </Typography>
      </Box>
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
    justify-content: space-between;
    flex-direction: row;
    border-bottom: 2px solid #e8e7e6;
    box-shadow: none;
  }
`

export default AppBar
