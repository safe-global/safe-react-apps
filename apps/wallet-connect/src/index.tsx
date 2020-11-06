import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { SafeProvider } from "@rmeissner/safe-apps-react-sdk";
import { Loader, theme } from "@gnosis.pm/safe-react-components";
import { ThemeProvider } from "styled-components";

import * as serviceWorker from "./serviceWorker";

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <SafeProvider loading={<Loader size="md" />}>
      <App />
    </SafeProvider>
  </ThemeProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
