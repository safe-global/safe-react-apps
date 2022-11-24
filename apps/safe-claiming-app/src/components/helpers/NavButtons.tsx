import { Box, Button } from "@mui/material"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import { useDarkMode } from "src/hooks/useDarkMode"

export const NavButtons = ({
  handleBack,
  handleNext,
  isNextEnabled = true,
  nextLabel,
  finalScreen,
}: {
  handleBack?: () => void
  handleNext?: () => void
  isNextEnabled?: boolean
  nextLabel?: string
  finalScreen?: boolean
}) => {
  const showNext = handleNext !== undefined
  const showBack = handleBack !== undefined
  nextLabel = nextLabel || "Next"
  const isDarkMode = useDarkMode()

  return (
    <Box mt={4} width="100%" display="flex" justifyContent="space-between">
      {showBack && (
        <Button
          variant="outlined"
          size="large"
          startIcon={<ArrowBackIcon />}
          sx={
            finalScreen && !isDarkMode
              ? {
                  border: ({ palette }) =>
                    `1px solid ${palette.safeGreen.main}`,
                  backgroundColor: "primary.main",
                  color: "safeGreen.main",
                  alignSelf: "flex-start",
                  "&:hover": {
                    backgroundColor: ({ palette }) => palette.safeGreen.dark,
                    border: ({ palette }) =>
                      `1px solid ${palette.safeGreen.main}`,
                  },
                }
              : undefined
          }
          disableElevation
          onClick={handleBack}
        >
          Back
        </Button>
      )}
      {showNext && (
        <Button
          size="large"
          onClick={handleNext}
          variant="contained"
          disableElevation
          disabled={!isNextEnabled}
        >
          {nextLabel}
        </Button>
      )}
    </Box>
  )
}
