import { Grid, Typography, Button } from '@mui/material'
import type { ReactElement } from 'react'

import { useDelegationStepper } from '@/components/Delegation'
import SafeLogo from '@/public/images/safe-logo.svg'

export const SuccessfulDelegation = (): ReactElement => {
  const { onNext } = useDelegationStepper()

  return (
    <Grid container flexDirection="column" alignItems="center" pt={16} px={1} pb={22}>
      <SafeLogo alt="Safe {DAO} logo" width={125} height={110} />

      <Typography variant="h1" mt={6} mb={2}>
        Transaction has been created
      </Typography>

      <Typography mb={4}>You successfully delegated your voting power</Typography>

      <Button variant="contained" color="primary" onClick={onNext}>
        Back to main
      </Button>
    </Grid>
  )
}