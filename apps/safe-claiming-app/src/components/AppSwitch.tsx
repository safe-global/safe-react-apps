import App from "src/App"

export const AppSwitch = () => {
  const location = window.location
  const hash = location.hash

  console.log(location, hash)

  if (hash === "#widget") {
    return <h1>THIS IS THE WIDGET</h1>
  }

  return <App />
}
