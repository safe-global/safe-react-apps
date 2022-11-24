import App from "src/App"
import { useLightDarkTheme } from "src/hooks/useDarkMode"
import { ThemeProvider } from "@mui/material"
import Widget from "src/widgets/Widget"

export const AppSwitch = () => {
  const theme = useLightDarkTheme()
  const location = window.location
  const [widgetId] = location.hash.split("+")

  return (
    <ThemeProvider theme={theme}>
      {widgetId === "#widget" && <Widget />}
      {widgetId === undefined && <App />}
    </ThemeProvider>
  )
}
