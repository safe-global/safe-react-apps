import { Grid, Typography, Box, Button } from '@mui/material'
import { useRouter } from 'next/router'
import { formatEther } from 'ethers/lib/utils'
import type { ReactElement } from 'react'

import { OverviewLinks } from '@/components/OverviewLinks'
import { useDelegate } from '@/hooks/useDelegate'
import { SelectedDelegate } from '@/components/SelectedDelegate'
import { AppRoutes } from '@/config/routes'
import { useTotalVotingPower } from '@/hooks/useTotalVotingPower'
import { TotalVotingPower } from '@/components/TotalVotingPower'
import { formatAmount } from '@/utils/formatters'
import { useTaggedAllocations } from '@/hooks/useTaggedAllocations'
import { useIsWrongChain } from '@/hooks/useIsWrongChain'
import SafeToken from '@/public/images/token.svg'
import { useIsSafeApp } from '@/hooks/useIsSafeApp'
import { CHAIN_SHORT_NAME, SAFE_URL, DEPLOYMENT_URL } from '@/config/constants'
import { useWallet } from '@/hooks/useWallet'
import type { ConnectedWallet } from '@/hooks/useWallet'

import css from './styles.module.css'

const getSafeAppUrl = (wallet: ConnectedWallet): string => {
  // `wallet` will exist as we are not in a Safe app
  const shortName = CHAIN_SHORT_NAME[Number(wallet?.chainId)]

  const url = new URL(`${SAFE_URL}/apps`)

  url.searchParams.append('safe', `${shortName}:${wallet?.address}`)
  url.searchParams.append('appUrl', `${DEPLOYMENT_URL}/${AppRoutes.claim}`)

  return url.toString()
}

export const Intro = (): ReactElement => {
  const router = useRouter()
  const isWrongChain = useIsWrongChain()
  const isSafeApp = useIsSafeApp()
  const wallet = useWallet()

  const delegate = useDelegate()

  const votingPower = useTotalVotingPower()
  const { total } = useTaggedAllocations()

  const hasAllocation = Number(total.allocation) > 0
  const isClaimable = Number(total.claimable) > 0

  const canDelegate = votingPower > 0 && !isWrongChain

  const onClaim = async () => {
    if (isSafeApp) {
      router.push(AppRoutes.claim)
    } else if (wallet) {
      window.open(getSafeAppUrl(wallet), '_blank')?.focus()
    }
  }

  const onDelegate = () => {
    router.push(AppRoutes.delegate)
  }

  return (
    <Grid container flexDirection="column" alignItems="center" px={1} py={6}>
      <SafeToken alt="Safe token logo" width={84} height={84} />

      <Box mt={4} display="flex" flexDirection="column" alignItems="center">
        <TotalVotingPower />
      </Box>

      {hasAllocation && (
        <Grid item xs={12} display="inline-flex" gap={6} my={3}>
          <Box className={css.overview}>
            <Typography variant="body2" color="text.secondary">
              Claimable now
            </Typography>
            <Typography fontWeight={700}>
              {formatAmount(formatEther(total.claimable), 2)} SAFE
            </Typography>
          </Box>
          <Box className={css.overview}>
            <Typography variant="body2" color="text.secondary">
              Claimable in the future
            </Typography>
            <Typography fontWeight={700}>
              {formatAmount(formatEther(total.inVesting), 2)} SAFE
            </Typography>
          </Box>
        </Grid>
      )}

      {isClaimable && (
        <Button variant="contained" size="stretched" onClick={onClaim} disabled={isWrongChain}>
          Claim tokens
        </Button>
      )}

      <Grid item px={5} mt={6} mb={4}>
        <SelectedDelegate
          delegate={delegate || undefined}
          onClick={onDelegate}
          disabled={!canDelegate}
          hint
        />
      </Grid>

      <Grid item xs={12}>
        <OverviewLinks />
      </Grid>
    </Grid>
  )
}
