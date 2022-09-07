import { Box, Paper, Typography } from "@mui/material"
import { ReactComponent as SafeHeaderGradient } from "src/assets/images/safe-header-logo-gradient.svg"
import TwitterIcon from "@mui/icons-material/Twitter"
import styled from "@emotion/styled"
import { AppState } from "src/App"
import { useEffect } from "react"
import { NavButtons } from "../helpers/NavButtons"
import { formatAmount } from "src/utils/format"
const TweetBox = styled(Box)`
  background: white;
  border-radius: 8px;
  margin-bottom: 16px;
`

const StyledTwitterIcon = styled(TwitterIcon)`
  fill: #00b4f7;
`

const StyledTwitterButton = styled.a`
  font-size: 14px;
  font-weight: bold;
  background-color: #00b4f7;
  padding: 8px 24px;
  color: white;
  border-radius: 40px;
  text-decoration: none;
  margin-top: 8px;

  &:hover {
    background-color: #05a2dc;
  }
`

const Success = ({
  handleUpdateState,
  handleBack,
  state,
}: {
  state: AppState
  handleBack: () => void
  handleUpdateState: (newState: AppState) => void
}) => {
  useEffect(() => {
    // trigger reload and update of claimed amount from on-chain
    handleUpdateState({ ...state, lastClaimTimestamp: new Date().getTime() })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleUpdateState])

  const formattedTokenAmount = formatAmount(
    Number(state.claimedAmount ?? "0"),
    2
  )

  const isCustomDelegate = !state.delegateData.some(
    (delegate) => delegate.address === state.delegate?.address
  )

  const tweetText = isCustomDelegate
    ? "I've just claimed my Safe governance tokens to help steward the public good that is @Safe 🔰🫡 🔰🫡"
    : state.delegate?.ens
    ? `I've just received my Safe governance tokens and delegated my voting power to ${state.delegate.ens} to help steward the public good that is @Safe 🔰🫡`
    : "I've just received my Safe governance tokens and delegated my voting power to help steward the public good that is @Safe 🔰🫡"

  const tweetURL = encodeURI(
    `https://twitter.com/intent/tweet?text=${tweetText}`
  )

  return (
    <Paper
      elevation={0}
      sx={{
        padding: 6,
        display: "flex",
        flexDirection: "column",
        height: 1,
        gap: 2,
        backgroundColor: "primary.main",
        alignItems: "center",
        color: "white",
      }}
    >
      <SafeHeaderGradient />
      <Typography variant="h1" my={1}>
        Congrats!
      </Typography>
      <Typography textAlign="center" mb={1}>
        You successfully started claiming{" "}
        <strong>{formattedTokenAmount}</strong> Tokens! <br />
        Once the transaction is signed and executed, the tokens
        <br />
        will be available in your Safe.
      </Typography>
      <Typography fontWeight="bold">Share your claim on Twitter:</Typography>
      <Box display="flex" flexDirection="column" alignItems="flex-end">
        <TweetBox color="black" padding={3}>
          <StyledTwitterIcon />
          <Typography marginTop={1}>{tweetText}</Typography>
        </TweetBox>
        <StyledTwitterButton
          href={tweetURL}
          target="_blank"
          rel="noopener noreferrer"
        >
          Tweet
        </StyledTwitterButton>
      </Box>
      <NavButtons finalScreen handleBack={handleBack} />
    </Paper>
  )
}

export default Success
