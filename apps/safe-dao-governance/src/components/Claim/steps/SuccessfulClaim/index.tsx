import { Grid, Typography, Button } from '@mui/material'
import type { Theme } from '@mui/material/styles'
import type { ReactElement } from 'react'

import { useClaimStepper } from '@/components/Claim'
import { useIsDarkMode } from '@/hooks/useIsDarkMode'
import SafeLogo from '@/public/images/safe-logo.svg'

export const SuccessfulClaim = (): ReactElement => {
  const { onNext, stepperState } = useClaimStepper()

  const isDarkMode = useIsDarkMode()

  const backgroundColor = ({ palette }: Theme) => (isDarkMode ? undefined : palette.primary.main)
  const textColor = isDarkMode ? undefined : 'white'
  const buttonColor = isDarkMode ? undefined : 'secondary'

  return (
    <Grid
      container
      flexDirection="column"
      alignItems="center"
      pt={16}
      px={12}
      pb={22}
      sx={{ backgroundColor }}
    >
      <SafeLogo alt="Safe {DAO} logo" width={125} height={110} />

      <Typography variant="h1" mt={6} mb={2} color={textColor}>
        Congrats!
      </Typography>

      <Typography mb={4} color={textColor} textAlign="center">
        You successfully started claiming {stepperState?.claimedAmount || '0'} Tokens!
        <br />
        Once the transaction is signed and executed, the tokens will be available in your Safe.
      </Typography>

      <Button variant="contained" color={buttonColor} onClick={onNext}>
        Back to main
      </Button>
    </Grid>
  )
}
