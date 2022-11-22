import App from "src/App"
import SnapshotWidget from "src/widgets/SnapshotWidget"
import ClaimingWidget from "src/widgets/ClaimingWidget"
import { useLightDarkTheme } from "src/hooks/useDarkMode"
import { ThemeProvider } from "@mui/material"

const CLAIMING_WIDGET_ID = "#claiming-widget"
const SNAPSHOT_WIDGET_ID = "#snapshot-widget"

export const AppSwitch = () => {
  const theme = useLightDarkTheme()
  const location = window.location
  const [widgetId] = location.hash.split("+")

  return (
    <ThemeProvider theme={theme}>
      {widgetId === CLAIMING_WIDGET_ID && <ClaimingWidget />}
      {widgetId === SNAPSHOT_WIDGET_ID && <SnapshotWidget />}
      {widgetId !== CLAIMING_WIDGET_ID && widgetId !== SNAPSHOT_WIDGET_ID && (
        <App />
      )}
    </ThemeProvider>
  )
}
