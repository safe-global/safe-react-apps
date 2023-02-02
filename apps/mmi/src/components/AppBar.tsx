import { Box } from '@material-ui/core'
import { AppBar as MuiAppBar, Typography, styled } from '@mui/material'
import { EthHashInfo } from '@safe-global/safe-react-components'

const AppBar = ({ account }: { account: string }) => {
  return (
    <StyledAppBar position="static" color="default">
      <Typography variant="h6" pl={4}>
        MetaMask Institutional
      </Typography>
      {account && (
        <Box display="flex" alignItems="center">
          <EthHashInfo address={account} showCopyButton />
        </Box>
      )}
    </StyledAppBar>
  )
}

const StyledAppBar = styled(MuiAppBar)`
  && {
    position: sticky;
    top: 0;
    background: ${({ theme }) => theme.palette.background.paper};
    height: 70px;
    align-items: center;
    justify-content: space-between;
    flex-direction: row;
    border-bottom: 2px solid ${({ theme }) => theme.palette.background.paper};
    box-shadow: none;
  }
`

export default AppBar
