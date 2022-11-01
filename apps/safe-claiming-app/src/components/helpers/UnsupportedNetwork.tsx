import { Paper, Typography } from "@mui/material"

export const UnsupportedNetwork = () => {
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
        Only Mainnet, Rinkeby and Goerli are supported by this Safe App
      </Typography>
    </Paper>
  )
}
