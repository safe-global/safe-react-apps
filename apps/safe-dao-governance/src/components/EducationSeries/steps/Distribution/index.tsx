import { Box, Grid, Typography } from '@mui/material'
import type { ReactElement } from 'react'

import { StepHeader } from '@/components/StepHeader'
import DistributionChart from '@/public/images/distribution-chart.svg'
import lightPalette from '@/styles/colors'
import { ExternalLink } from '@/components/ExternalLink'
import { NavButtons } from '@/components/NavButtons'
import { useEducationSeriesStepper } from '@/components/EducationSeries'

import css from './styles.module.css'

const DISTRIBUTION_PROPOSAL_URL =
  'https://forum.gnosis-safe.io/t/safe-voting-power-and-circulating-supply/558'

export const Distribution = (): ReactElement => {
  const { onBack, onNext } = useEducationSeriesStepper()

  return (
    <Grid container px={6} pt={5} pb={4}>
      <Grid item xs={12} mb={3}>
        <StepHeader title="Distribution" />
      </Grid>

      <Typography mb={3}>
        Safe Tokens are distributed to stakeholders of the ecosystem interested in shaping the
        future of Safe and smart-contract accounts.
      </Typography>
      <Grid item xs={12}>
        <ExternalLink href={DISTRIBUTION_PROPOSAL_URL}>Read full proposal</ExternalLink>
      </Grid>

      <Grid item xs={12} display="flex" justifyContent="center" mb={3} mt={2}>
        <DistributionChart />
      </Grid>

      <Grid container direction="row" justifyItems="space-between">
        <Grid item direction="column" xs={12} mb={4}>
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <Typography
              className={css.percentage}
              sx={{
                backgroundColor: ({ palette }) => palette.secondary.main,
                color: lightPalette.text.primary,
              }}
            >
              60%
            </Typography>
            <Typography variant="h6" fontWeight={700}>
              Community Treasuries
            </Typography>
          </Box>
          <Typography>
            40% Safe {`{DAO}`} Treasury
            <br />
            15% GnosisDAO Treasury
            <br />
            5% Joint Treasury (GNO &lt;&gt; SAFE)
          </Typography>
        </Grid>

        <Grid item direction="column" xs={6} mb={4}>
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <Typography
              className={css.percentage}
              sx={{
                backgroundColor: ({ palette }) => palette.secondary.light,
                color: lightPalette.text.primary,
              }}
            >
              15%
            </Typography>
            <Typography variant="h6" fontWeight={700}>
              Core Contributors
            </Typography>
          </Box>
          <Typography>Current and future core contributor teams</Typography>
        </Grid>

        <Grid item direction="column" xs={6} mb={4}>
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <Typography
              className={css.percentage}
              sx={{
                backgroundColor: ({ palette }) => palette.info.main,
                color: lightPalette.text.primary,
              }}
            >
              15%
            </Typography>
            <Typography variant="h6" fontWeight={700}>
              Safe Foundation
            </Typography>
          </Box>
          <Typography>
            8% strategic raise
            <br />
            7% grants and reserve
          </Typography>
        </Grid>

        <Grid item direction="column" xs={6}>
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <Typography
              className={css.percentage}
              sx={{
                backgroundColor: ({ palette }) => palette.success.main,
                color: ({ palette }) => palette.background.paper,
              }}
            >
              5%
            </Typography>
            <Typography variant="h6" fontWeight={700}>
              Guardians
            </Typography>
          </Box>
          <Typography>
            1.25% allocation
            <br />
            1.25% vested allocation
            <br />
            2.5% future programs
          </Typography>
        </Grid>

        <Grid item direction="column" xs={6} mb={5}>
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <Typography
              className={css.percentage}
              sx={{
                backgroundColor: ({ palette }) => palette.warning.main,
                color: ({ palette }) => palette.background.paper,
              }}
            >
              5%
            </Typography>
            <Typography variant="h6" fontWeight={700}>
              User
            </Typography>
          </Box>
          <Typography>
            2.5% allocation
            <br />
            2.5% vested allocation
          </Typography>
        </Grid>
      </Grid>

      <NavButtons onBack={onBack} onNext={onNext} />
    </Grid>
  )
}
