import { Box, Paper, Typography } from "@mui/material"
import { ReactComponent as SafeHeaderGradient } from "src/assets/images/safe-header-logo-gradient.svg"
import { NavButtons } from "src/components/helpers/NavButtons"

type Props = {
  handleNext: () => void
}

const Intro = ({ handleNext }: Props) => {
  return (
    <>
      <Paper
        elevation={0}
        sx={{
          paddingX: 6,
          paddingY: 12,
          textAlign: "center",
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          height: 1,
        }}
      >
        <SafeHeaderGradient />
        <Typography variant="h1" mt={6} mb={3}>
          Welcome to the next generation of digital ownership{" "}
        </Typography>
        <ul>
          <Typography
            component="li"
            variant="body1"
            marginBottom={3}
            textAlign={"left"}
          >
            SafeDAO is on a mission to unlock digital ownership for everyone in
            web3.
          </Typography>
          <Typography
            component="li"
            variant="body1"
            marginBottom={3}
            textAlign={"left"}
          >
            {" "}
            We will do this by establishing a universal standard for custody of
            digital assets, data and identity with smart contract based
            accounts.
          </Typography>
          <Typography
            component="li"
            variant="body1"
            marginBottom={3}
            textAlign={"left"}
          >
            You have been chosen to help govern the SafeDAO, and decide on the
            future of web3 ownership. Use this power wisely!
          </Typography>
        </ul>
        <Box>
          <NavButtons
            handleNext={handleNext}
            nextLabel="Start your claiming process"
          />
        </Box>
      </Paper>
    </>
  )
}

export default Intro
