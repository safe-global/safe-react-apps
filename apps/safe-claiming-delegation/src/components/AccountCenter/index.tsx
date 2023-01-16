import { useState } from 'react'
import { ButtonBase, Box, Popover, Paper, Typography, Button } from '@mui/material'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import type { ReactElement, MouseEvent } from 'react'

import { useWallet } from '@/hooks/useWallet'
import { useOnboard } from '@/hooks/useOnboard'
import { Identicon } from '@/components/Identicon'
import { useChains } from '@/hooks/useChains'
import { WalletInfo } from '@/components/WalletInfo'
import { EthHashInfo } from '@/components/EthHashInfo'
import type { ConnectedWallet } from '@/hooks/useWallet'

import css from './styles.module.css'

const Popper = ({ wallet }: { wallet: ConnectedWallet }): ReactElement => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const onboard = useOnboard()

  const { data: chains } = useChains()
  const chain = chains?.results.find(chain => chain.chainId === wallet.chainId)

  const handleDisconnect = () => {
    onboard?.disconnectWallet({ label: wallet.label })
  }

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const ExpandIcon = open ? ExpandLessIcon : ExpandMoreIcon

  return (
    <>
      <ButtonBase onClick={handleClick} disableRipple className={css.dropdown}>
        <Box className={css.buttonContainer}>
          {chain && <WalletInfo wallet={wallet} chain={chain} />}

          <Box display="flex" alignItems="center" justifyContent="flex-end" marginLeft="auto">
            <ExpandIcon color="border" />
          </Box>
        </Box>
      </ButtonBase>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        sx={{ marginTop: 1 }}
      >
        <Paper className={css.popoverContainer} variant="outlined">
          <Identicon address={wallet.address} />

          {wallet.ens && (
            <Typography variant="h5" className={css.addressName}>
              {wallet.ens}
            </Typography>
          )}

          <Box bgcolor="border.background" px={2} py={1} fontSize={14}>
            <EthHashInfo
              prefix={chain?.shortName}
              address={wallet.address}
              showAvatar={false}
              showCopyButton
            />
          </Box>

          <Box className={css.rowContainer}>
            <Box className={css.row}>
              <Typography variant="caption">Wallet</Typography>
              <Typography variant="body2">{wallet.label}</Typography>
            </Box>
            <Box className={css.row}>
              <Typography variant="caption">Connected network</Typography>
              <Typography variant="body2">{chain?.chainName}</Typography>
            </Box>
          </Box>

          <Button
            onClick={handleDisconnect}
            variant="danger"
            size="small"
            fullWidth
            disableElevation
          >
            Disconnect
          </Button>
        </Paper>
      </Popover>
    </>
  )
}

export const AccountCenter = (): ReactElement | null => {
  const wallet = useWallet()

  if (!wallet) {
    return null
  }

  return <Popper wallet={wallet} />
}
