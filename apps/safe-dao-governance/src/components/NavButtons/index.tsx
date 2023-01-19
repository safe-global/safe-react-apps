import { Box, Button } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import clsx from 'clsx'
import type { ReactNode, ReactElement } from 'react'

import css from './styles.module.css'

export const NavButtons = ({
  onBack,
  onNext,
  nextLabel = 'Next',
  isBackDisabled = false,
  isNextDisabled = false,
}: {
  onBack?: () => void
  onNext?: () => void
  nextLabel?: ReactNode
  isBackDisabled?: boolean
  isNextDisabled?: boolean
}): ReactElement => {
  return (
    <Box className={css.container}>
      {onBack && (
        <Button
          variant="outlined"
          size="stretched"
          onClick={onBack}
          disableElevation
          startIcon={<ArrowBackIcon />}
          className={css.button}
          disabled={isBackDisabled}
        >
          Back
        </Button>
      )}
      {onNext && (
        <Button
          variant="contained"
          size="stretched"
          onClick={onNext}
          disableElevation
          className={clsx(css.button, css.next)}
          disabled={isNextDisabled}
        >
          {nextLabel}
        </Button>
      )}
    </Box>
  )
}
