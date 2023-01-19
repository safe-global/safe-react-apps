import { Paper } from '@mui/material'
import type { ReactElement } from 'react'

import SafeLogo from '@/public/images/header-logo.svg'
import { AccountCenter } from '@/components/AccountCenter'
import { ChainSwitcher } from '@/components/ChainSwitcher'
import { useIsSafeApp } from '@/hooks/useIsSafeApp'

import css from './styles.module.css'

export const Header = (): ReactElement | null => {
  const isSafeApp = useIsSafeApp()

  if (isSafeApp) {
    return null
  }

  return (
    <Paper className={css.container} sx={{ px: 2, gap: 2 }} component="header">
      <SafeLogo alt="Safe logo" />

      <div className={css.wallet}>
        <ChainSwitcher />

        <AccountCenter />
      </div>
    </Paper>
  )
}
