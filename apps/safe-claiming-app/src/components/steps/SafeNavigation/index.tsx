import { Link, Paper, Typography } from "@mui/material"
import Box from "@mui/system/Box"
import { ReactComponent as ExternalLink } from "src/assets/images/external_link.svg"

import Checkmark from "@mui/icons-material/Check"
import { DISCORD_URL, FORUM_URL, GOVERNANCE_URL } from "src/config/constants"
import { NavButtons } from "src/components/helpers/NavButtons"

type Props = {
  handleBack: () => void
  handleNext: () => void
}

const SafeNavigation = ({ handleNext, handleBack }: Props) => {
  return (
    <Paper elevation={0} sx={{ padding: 6 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="flex-end"
        marginBottom={3}
      >
        <Typography fontWeight={700} variant="h4">
          Navigating SafeDAO
        </Typography>
        <Typography variant="subtitle1">Step 1 of 3</Typography>
      </Box>
      <Typography mb={3}>
        SafeDAO aims to foster a vibrant ecosystem of applications and wallets
        leveraging Safe smart contract accounts. This will be achieved through
        data-backed discussions, grants, ecosystem investments, as well as
        providing developer tools and infrastructure.
      </Typography>

      <Typography fontWeight={700} variant="h5" mb={3}>
        How to get involved:
      </Typography>

      <Box display="flex" flexDirection="column" gap={3}>
        <Box display="inline-flex" alignItems="flex-start" gap={2}>
          <Checkmark />
          <Typography>
            Discuss SafeDAO improvements - post topics and discuss in our{" "}
            <Link
              href={FORUM_URL}
              rel="noopener noreferrer"
              target="_blank"
              display="inline-flex"
              alignItems={"center"}
            >
              Forum
              <ExternalLink style={{ marginLeft: "4px" }} />
            </Link>
          </Typography>
        </Box>
        <Box display="inline-flex" alignItems="flex-start" gap={2}>
          <Checkmark />
          <Typography>
            Propose improvements - read our governance{" "}
            <Link
              href={GOVERNANCE_URL}
              rel="noopener noreferrer"
              target="_blank"
              display="inline-flex"
              alignItems={"center"}
            >
              process
              <ExternalLink style={{ marginLeft: "4px" }} />
            </Link>{" "}
            and post an SIP.
          </Typography>
        </Box>
        <Box display="inline-flex" alignItems="flex-start" gap={2}>
          <Checkmark />
          <Typography>Govern improvements - vote on our Snapshot.</Typography>
        </Box>
        <Box display="inline-flex" alignItems="flex-start" gap={2}>
          <Checkmark />
          <Typography>
            Chat with the community - join our Safe{" "}
            <Link
              href={DISCORD_URL}
              rel="noopener noreferrer"
              target="_blank"
              display="inline-flex"
              alignItems={"center"}
            >
              Discord
              <ExternalLink style={{ marginLeft: "4px" }} />
            </Link>{" "}
            and post an SIP.
          </Typography>
        </Box>
        <Typography
          variant="h5"
          fontWeight={700}
          textAlign="left"
          maxWidth="410px"
          alignSelf="flex-end"
        >
          now&hellip;
          <br /> &hellip;help decide on the future of ownership with $SAFE.
        </Typography>
      </Box>

      <NavButtons handleBack={handleBack} handleNext={handleNext} />
    </Paper>
  )
}

export default SafeNavigation
