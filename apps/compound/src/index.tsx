import React from "react";
import ReactDOM from "react-dom";
import { ThemeProvider } from "styled-components";

import GlobalStyles from "./global";
import * as serviceWorker from "./serviceWorker";
import App from "./App";
import getTheme from "./customTheme";

const theme = getTheme();

ReactDOM.render(
  <>
    <GlobalStyles />
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
