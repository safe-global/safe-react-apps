import React from "react"
import SafeProvider from "@gnosis.pm/safe-apps-react-sdk"
import { CssBaseline, GlobalStyles } from "@mui/material"

import { render } from "react-dom"
import { AppSwitch } from "./components/AppSwitch"

const container = document.getElementById("root") as HTMLDivElement

render(
  <React.StrictMode>
    <GlobalStyles styles={{ body: { overflow: "hidden" } }} />
    <CssBaseline />
    <SafeProvider loader={<h1>Waiting for Safe...</h1>}>
      <AppSwitch />
    </SafeProvider>
  </React.StrictMode>,
  container
)
