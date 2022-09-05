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

  &:hover {
    background-color: #05a2dc;
  }
`

const tweetText =
  "@gnosisSafe I just got my Safe token Airdrop. Did you get yours? ;)"
const tweetHashtags = "staysafe,safedao,safeairdrop"
const tweetURL = encodeURI(
  `https://twitter.com/intent/tweet?text=${tweetText}&hashtags=${tweetHashtags}`
)

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
  }, [handleUpdateState])

  const formattedTokenAmount = formatAmount(
    Number(state.claimedAmount ?? "0"),
    2
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
      <Typography variant="h1">Congrats!</Typography>
      <Typography textAlign="center">
        You successfully claimed <strong>{formattedTokenAmount}</strong> Tokens!{" "}
        <br />
        Share your claim on Twitter ;)
      </Typography>
      <Box display="flex" flexDirection="column" alignItems="flex-end">
        <TweetBox color="black" padding={3} marginTop={3}>
          <StyledTwitterIcon />
          <Typography marginTop={1}>
            I&apos;ve just received my Safe governance tokens to help steward
            the public good that is Safe! #staysafe.
          </Typography>
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
