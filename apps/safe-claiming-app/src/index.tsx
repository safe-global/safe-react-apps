import React from "react"
import { CssBaseline, GlobalStyles } from "@mui/material"

import { render } from "react-dom"
import { AppSwitch } from "./components/AppSwitch"

const container = document.getElementById("root") as HTMLDivElement

render(
  <React.StrictMode>
    <GlobalStyles styles={{ body: { overflow: "hidden" } }} />
    <CssBaseline />
    <AppSwitch />
  </React.StrictMode>,
  container
)
