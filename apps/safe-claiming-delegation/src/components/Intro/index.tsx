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
import { useAllocationTypes } from '@/hooks/useAllocationTypes'

import css from './styles.module.css'

export const Intro = (): ReactElement => {
  const router = useRouter()

  const delegate = useDelegate()

  const votingPower = useTotalVotingPower()
  const { total } = useAllocationTypes()

  const hasAllocation = Number(total.allocation) > 0
  const isClaimable = Number(total.claimable) > 0
  const canDelegate = votingPower > 0

  const onClaim = () => {
    router.push(AppRoutes.claim)
  }

  const onDelegate = () => {
    router.push(AppRoutes.delegate)
  }

  return (
    <Grid container flexDirection="column" alignItems="center" pt={2} px={1} pb={6}>
      <img src="./images/token.svg" alt="Safe token logo" width={84} height={84} />

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
        <Button variant="contained" size="stretched" onClick={onClaim}>
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
