import { AppBar as MuiAppBar, Typography, styled } from '@mui/material'

const AppBar = () => {
  return (
    <StyledAppBar position="static" color="default">
      <Typography variant="h6" pl={4}>
        MetaMask Institutional
      </Typography>
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

export default AppBar
