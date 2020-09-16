import React from "react";
import App from "./App";
import { SafeProvider } from "@rmeissner/safe-apps-react-sdk";
import { Loader, theme } from "@gnosis.pm/safe-react-components";
import { ThemeProvider } from "styled-components";

const SafeConnect = () => (
  <ThemeProvider theme={theme}>
    <SafeProvider loading={<Loader size="md" />}>
      <App />
    </SafeProvider>
  </ThemeProvider>
);

export default SafeConnect;
