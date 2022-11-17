import { Paper, Typography } from "@mui/material"

export const UnexpectedError = ({ error }: { error: string | Error }) => {
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
      <Typography
        variant="h3"
        sx={{
          color: ({ palette }) => palette.error.main,
        }}
      >
        Unexpected Error while loading the app:{" "}
        {typeof error === "string" ? error : error.message}
      </Typography>
      <Typography mt={4} variant="subtitle1">
        Please try refreshing the app.
      </Typography>
    </Paper>
  )
}
