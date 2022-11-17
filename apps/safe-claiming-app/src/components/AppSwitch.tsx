import App from "src/App"
import Snapshot from "src/widgets/Snapshot"
import ClaimingApp from "src/widgets/Widget"

const CLAIMING_WIDGET_ID = "#claiming-widget"
const SNAPSHOT_WIDGET_ID = "#snapshot-widget"

export const AppSwitch = () => {
  const location = window.location
  const hash = location.hash

  switch (hash) {
    case CLAIMING_WIDGET_ID:
      return <ClaimingApp />
    case SNAPSHOT_WIDGET_ID:
      return <Snapshot />
    default:
      return <App />
  }
}
