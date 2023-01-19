import { Box, Button } from '@mui/material'
import { hexValue } from 'ethers/lib/utils'
import type { ReactElement } from 'react'

import { useChains } from '@/hooks/useChains'
import { useOnboard } from '@/hooks/useOnboard'
import { DEFAULT_CHAIN_ID } from '@/config/constants'
import { useWallet } from '@/hooks/useWallet'

import css from './styles.module.css'

export const ChainSwitcher = (): ReactElement | null => {
  const onboard = useOnboard()
  const wallet = useWallet()
  const { data: chains } = useChains()
  const defaultChain = chains?.results.find(chain => chain.chainId === DEFAULT_CHAIN_ID.toString())

  if (!wallet || wallet.chainId === DEFAULT_CHAIN_ID.toString()) {
    return null
  }

  const handleChainSwitch = () => {
    const chainId = hexValue(DEFAULT_CHAIN_ID)
    onboard?.setChain({ chainId })
  }

  return (
    <Button onClick={handleChainSwitch} variant="outlined" size="small" color="primary">
      Switch to&nbsp;
      <Box className={css.circle} bgcolor={defaultChain?.theme?.backgroundColor || ''} />
      &nbsp;{defaultChain?.chainName}
    </Button>
  )
}
