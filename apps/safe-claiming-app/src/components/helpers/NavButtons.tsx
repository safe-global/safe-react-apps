import { Box, Button } from "@mui/material"

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

  return (
    <Box mt={4} width="100%" display="flex" justifyContent="space-between">
      {showBack && (
        <Button
          variant="outlined"
          size="large"
          sx={
            finalScreen
              ? {
                  backgroundColor: "#fff",
                  alignSelf: "flex-start",
                  "&:hover": {
                    backgroundColor: ({ palette }) => palette.safeGrey.main,
                  },
                }
              : undefined
          }
          disableElevation
          onClick={handleBack}
        >
          &larr; Back
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
