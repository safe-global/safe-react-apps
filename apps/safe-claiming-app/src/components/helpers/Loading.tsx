import { CircularProgress, Paper, Typography } from "@mui/material"

export const Loading = () => {
  return (
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
      <Typography variant="h3">
        <CircularProgress /> Loading airdrop data for connected safe
      </Typography>
    </Paper>
  )
}
