import { Grid, Typography, Box, Paper } from '@mui/material'
import Checkmark from '@mui/icons-material/Check'
import type { ReactElement, ReactNode } from 'react'

import { StepHeader } from '@/components/StepHeader'
import { ExternalLink } from '@/components/ExternalLink'
import { NavButtons } from '@/components/NavButtons'
import { useEducationSeriesStepper } from '@/components/EducationSeries'

import css from './styles.module.css'

const FORUM_URL = 'https://forum.safe.global'
const GOVERNANCE_URL = 'https://forum.gnosis-safe.io/t/how-to-safedao-governance-process/846'
const SNAPSHOT_URL = 'https://snapshot.org/#/safe.eth'
const DISCORD_URL = 'https://chat.safe.global/'

const Point = ({ children }: { children: ReactNode }): ReactElement => {
  return (
    <Box display="inline-flex" gap={2}>
      <Checkmark />
      <Typography>{children}</Typography>
    </Box>
  )
}

export const SafeDao = (): ReactElement => {
  const { onBack, onNext } = useEducationSeriesStepper()

  return (
    <Grid container px={6} pt={5} pb={4}>
      <Grid item xs={12} mb={3}>
        <StepHeader title="Navigating SafeDAO" />
      </Grid>

      <Typography mb={3}>
        SafeDAO aims to foster a vibrant ecosystem of applications and wallets leveraging Safe smart
        contract accounts. This will be achieved through data-backed discussions, grants, ecosystem
        investments, as well as providing developer tools and infrastructure.
      </Typography>

      <Typography fontWeight={700} variant="h3" mb={3}>
        How to get involved:
      </Typography>

      <Box display="flex" flexDirection="column" gap={3} mb={3.5}>
        <Point>
          Discuss SafeDAO improvements - post topics and discuss in our{' '}
          <ExternalLink href={FORUM_URL}>Forum</ExternalLink>
        </Point>

        <Point>
          Propose improvements - read our{' '}
          <ExternalLink href={GOVERNANCE_URL}>governance process</ExternalLink> and post an SEP.
        </Point>

        <Point>
          Govern improvements - vote on our{' '}
          <ExternalLink href={SNAPSHOT_URL}>Snapshot</ExternalLink>.
        </Point>

        <Point>
          Chat with the community - join our Safe{' '}
          <ExternalLink href={DISCORD_URL}>Discord</ExternalLink>.
        </Point>

        <Paper className={css.info}>
          <Typography variant="h4" fontWeight={700}>
            Now&hellip;
            <br />
            Help decide on the future of ownership with $SAFE.
          </Typography>
        </Paper>
      </Box>

      <NavButtons onBack={onBack} onNext={onNext} />
    </Grid>
  )
}
