import { Box, styled } from "@mui/material"

const StyledBar = styled(Box)`
  position: relative;
  max-width: 100%;
  overflow-y: auto;
  height: 6px;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  margin-bottom: -6px;

  transition: width 0.5s ease;

  // Animation:
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.palette.safeGreen.main},
    #5fddff
  );
  background-size: 300% 300%;
  animation: gradient 10s ease infinite;

  @keyframes gradient {
    0% {
      background-position: 0% 0%;
    }
    50% {
      background-position: 100% 0%;
    }
    100% {
      background-position: 0% 0%;
    }
  }
`

export const ProgressBar = ({ progress }: { progress: number }) => {
  return <StyledBar width={progress * 100 + "%"} />
}
