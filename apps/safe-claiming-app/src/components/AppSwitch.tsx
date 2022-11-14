import App from "src/App"
import Widget from "src/Widget"

export const AppSwitch = () => {
  const location = window.location
  const hash = location.hash

  if (hash === "#widget") {
    return <Widget />
  }

  return <App />
}
