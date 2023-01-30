import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import { useSafeAppsSDK } from '@safe-global/safe-apps-react-sdk'
import styled from 'styled-components'

import AddressLabel from 'src/components/address-label/AddressLabel'

const Header = () => {
  const { safe } = useSafeAppsSDK()

  return (
    <AppBar>
      <Toolbar>
        <TitleWapper>
          <Typography component="h1" variant="h6">
            Sign-In With Ethereum Delegate Manager
          </Typography>
        </TitleWapper>

        <Typography>
          <AddressLabel
            address={safe.safeAddress}
            showCopyIntoClipboardButton
            showBlockExplorerLink
            ariaLabel="conected Safe address"
          />
        </Typography>
      </Toolbar>
    </AppBar>
  )
}

export default Header

const TitleWapper = styled.div`
  flex-grow: 1;
`

const AppBar = styled.header`
  position: fixed;
  width: 100%;
  border-bottom: 1px solid #e2e3e3;
  z-index: 10;
  background-color: white;
  height: 64px;
  box-sizing: border-box;
`
