import { Grid, Paper, styled, Typography } from "@mui/material"
import Box from "@mui/system/Box"

import { ReactComponent as PieChart } from "src/assets/images/pie-chart-educational.svg"
import { NavButtons } from "src/components/helpers/NavButtons"

const PercentageWrapper = styled(Typography)`
  background-color: ${({ theme }) => theme.palette.safeGreen.main};
  border-radius: 6px;
  padding: 0px 8px;
`

type Props = {
  handleBack: () => void
  handleNext: () => void
}

const Distribution = ({ handleNext, handleBack }: Props) => {
  return (
    <Paper elevation={0} sx={{ padding: 6 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="flex-end"
        marginBottom={3}
      >
        <Typography fontWeight={700} variant="h4">
          Distribution
        </Typography>
      </Box>
      <Typography mb={3}>
        Safe Tokens will be distributed to stakeholders of the ecosystem
        interested in shaping the future of Safe and smart-contract accounts.
      </Typography>

      <PieChart />

      <Grid container direction="row" justifyItems="space-between">
        <Grid item direction={"column"} xs={12} mb={4}>
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <PercentageWrapper>60%</PercentageWrapper>
            <Typography variant="h6" fontWeight={700}>
              Community Treasuries
            </Typography>
          </Box>
          <Typography>
            40% SafeDAO Treasury <br />
            15% GnosisDAO Treasury <br />
            5% Joint Treasury (GNO &lt;&gt; SAFE)
          </Typography>
        </Grid>
        <Grid item direction={"column"} xs={6} mb={4}>
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <PercentageWrapper>15%</PercentageWrapper>
            <Typography variant="h6" fontWeight={700}>
              Core Contributors
            </Typography>
          </Box>
          <Typography>Current and future core contributor teams</Typography>
        </Grid>
        <Grid item direction={"column"} xs={6} mb={4}>
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <PercentageWrapper>15%</PercentageWrapper>
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
        <Grid item direction={"column"} xs={6}>
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <PercentageWrapper>5%</PercentageWrapper>
            <Typography variant="h6" fontWeight={700}>
              Guardians
            </Typography>
          </Box>
          <Typography>
            1.25% allocation
            <br />
            1.25% vested allocation <br />
            2.5% future programs
          </Typography>
        </Grid>
        <Grid item direction={"column"} xs={6}>
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <PercentageWrapper>5%</PercentageWrapper>
            <Typography variant="h6" fontWeight={700}>
              User
            </Typography>
          </Box>
          <Typography>
            2.25% allocation
            <br />
            2.25% vested allocation <br />
          </Typography>
        </Grid>
      </Grid>
      <NavButtons handleBack={handleBack} handleNext={handleNext} />
    </Paper>
  )
}

export default Distribution
