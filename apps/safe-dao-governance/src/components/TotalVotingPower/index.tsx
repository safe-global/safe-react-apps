import { Typography } from '@mui/material'
import type { ReactElement } from 'react'

import { useTotalVotingPower } from '@/hooks/useTotalVotingPower'
import { formatAmount } from '@/utils/formatters'

export const TotalVotingPower = (): ReactElement => {
  const votingPower = useTotalVotingPower()
  const amount = formatAmount(votingPower, 2)

  return (
    <>
      <Typography color="text.secondary">Total voting power is</Typography>

      <Typography variant="h2" mt={0.5}>
        {amount} SAFE
      </Typography>
    </>
  )
}
