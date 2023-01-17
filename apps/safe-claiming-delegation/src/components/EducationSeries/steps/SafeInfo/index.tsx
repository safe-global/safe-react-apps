import { Grid, Typography, Box } from '@mui/material'
import type { ReactElement } from 'react'

import LockIcon from '@/public/images/lock.svg'
import AssetsIcon from '@/public/images/assets.svg'
import { StepHeader } from '@/components/StepHeader'
import { NavButtons } from '@/components/NavButtons'
import { useEducationSeriesStepper } from '@/components/EducationSeries'

import css from './styles.module.css'

export const SafeInfo = (): ReactElement => {
  const { onNext } = useEducationSeriesStepper()

  return (
    <Grid container px={6} pt={5} pb={4}>
      <Grid item xs={12} mb={3}>
        <StepHeader title="What is Safe?" />
      </Grid>

      <Typography mb={3}>
        Safe is critical infrastructure for Web3. It is a programmable wallet that enables secure
        management of digital assets, data and identity.
        <br />
        <br />
        With our token, Safe is now a community-driven ownership platform.
      </Typography>

      <Box display="flex" mb={8} gap={5}>
        <Box className={css.info}>
          <Typography color="text.secondary" mb={1}>
            Total Safes created
          </Typography>
          <Box display="inline-flex" gap={1} alignItems="center">
            <LockIcon />
            <Typography variant="h3" fontWeight={700} ml={1}>
              &gt;1,000,000
            </Typography>
          </Box>
        </Box>

        <Box className={css.info}>
          <Typography color="text.secondary" mb={1}>
            Total value protected
          </Typography>
          <Box display="inline-flex" gap={1} alignItems="center">
            <AssetsIcon />
            <Typography variant="h3" fontWeight={700}>
              $41B
            </Typography>
          </Box>
        </Box>
      </Box>

      <Typography variant="h3" fontWeight={700} mb={2}>
        Why did we launch a token?
      </Typography>

      <Typography mb={5}>
        As critical web3 infrastructure, Safe needs to be a community-owned, censorship resistant
        project, with a committed ecosystem stewarding its decisions. A governance token is needed
        to help coordinate this effort.
      </Typography>

      <NavButtons onNext={onNext} />
    </Grid>
  )
}
