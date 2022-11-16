import App from "src/App"
import Snapshot from "src/widgets/Snapshot"
import ClaimingApp from "src/widgets/Widget"

export const AppSwitch = () => {
  const location = window.location
  const hash = location.hash

  switch (hash) {
    case "#widget":
      return <ClaimingApp />
    case "#snapshot_widget":
      return <Snapshot />
    default:
      return <App />
  }
}
