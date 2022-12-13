import { Button, Paper, Typography, useTheme } from "@mui/material"
import { ReactComponent as ExternalLink } from "src/assets/images/external_link.svg"
import { ReactComponent as SafeLogoHeader } from "src/assets/images/safe-header-logo-plain.svg"

const NoAirdrop = () => {
  const { palette } = useTheme()
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
        <SafeLogoHeader color={palette.text.primary} />
        <Typography variant="h1" marginX="auto" fontWeight={700} mt={6} mb={3}>
          Sorry, the airdrop is not available for you at the moment.
        </Typography>
        <Typography variant="body1" marginBottom={6}>
          Want to learn how to participate more in future initiatives from Safe?
          <br />
          Check out more information at
        </Typography>
        <div style={{ display: "inline-flex", gap: "16px" }}>
          <Button
            href="https://snapshot.org/#/safe.eth"
            target="_blank"
            rel="noopener noreferrer"
            variant="outlined"
          >
            SafeDAO
            <ExternalLink style={{ marginLeft: "4px" }} />
          </Button>
          <Button
            href="https://forum.gnosis-safe.io/"
            target="_blank"
            rel="noopener noreferrer"
            variant="outlined"
          >
            Forum
            <ExternalLink style={{ marginLeft: "4px" }} />
          </Button>
        </div>
      </Paper>
    </>
  )
}

export default NoAirdrop
