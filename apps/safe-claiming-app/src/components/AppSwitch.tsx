import App from "src/App"
import SnapshotWidget from "src/widgets/SnapshotWidget"
import ClaimingWidget from "src/widgets/ClaimingWidget"

const CLAIMING_WIDGET_ID = "#claiming-widget"
const SNAPSHOT_WIDGET_ID = "#snapshot-widget"

export const AppSwitch = () => {
  const location = window.location
  const hash = location.hash

  switch (hash) {
    case CLAIMING_WIDGET_ID:
      return <ClaimingWidget />
    case SNAPSHOT_WIDGET_ID:
      return <SnapshotWidget />
    default:
      return <App />
  }
}
