import React from "react"
import SafeProvider from "@gnosis.pm/safe-apps-react-sdk"
import { CssBaseline, GlobalStyles, ThemeProvider } from "@mui/material"

import theme from "src/config/theme"
import { render } from "react-dom"
import { AppSwitch } from "./components/AppSwitch"

const container = document.getElementById("root") as HTMLDivElement

render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <GlobalStyles
        styles={{ body: { overflow: "hidden", color: "#121312" } }}
      />
      <CssBaseline />
      <SafeProvider loader={<h1>Waiting for Safe...</h1>}>
        <AppSwitch />
      </SafeProvider>
    </ThemeProvider>
  </React.StrictMode>,
  container
)
