import App from "src/App"
import { useLightDarkTheme } from "src/hooks/useDarkMode"
import { ThemeProvider } from "@mui/material"
import Widget from "src/widgets/Widget"

export const AppSwitch = () => {
  const theme = useLightDarkTheme()
  const widgetId = window.location.hash

  return (
    <ThemeProvider theme={theme}>
      {widgetId === "#widget" && <Widget />}
      {widgetId === undefined && <App />}
    </ThemeProvider>
  )
}
