import React from "react";
import { ThemeProvider } from "styled-components";

import getTheme from "./customTheme";
import App from "./App";

const theme = getTheme();

const Compound = () => {
  return (
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  );
};

export default Compound;
