import App from "src/App"
import { useLightDarkTheme } from "src/hooks/useDarkMode"
import {
  Box,
  CircularProgress,
  CssBaseline,
  ThemeProvider,
} from "@mui/material"
import Widget from "src/widgets/Widget"
import SafeProvider from "@gnosis.pm/safe-apps-react-sdk"

export const AppSwitch = () => {
  const theme = useLightDarkTheme()
  const widgetId = window.location.hash.split("+")[0]

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SafeProvider
        loader={
          <Box
            display="flex"
            height="100vh"
            justifyContent="center"
            alignItems="center"
            sx={{
              backgroundColor: ({ palette }) => palette.background.default,
            }}
          >
            <CircularProgress />
          </Box>
        }
      >
        {widgetId === "#widget" ? <Widget /> : <App />}
      </SafeProvider>
    </ThemeProvider>
  )
}
