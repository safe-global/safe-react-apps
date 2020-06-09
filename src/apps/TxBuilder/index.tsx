import React from "react";
import { ThemeProvider } from "styled-components";
import { theme } from "@gnosis.pm/safe-react-components";

import Dashboard from "./components/Dashboard";
import SafeProvider from "./providers/SafeProvider";

export default () => (
  <ThemeProvider theme={theme}>
    <SafeProvider>
      <Dashboard />
    </SafeProvider>
  </ThemeProvider>
);
