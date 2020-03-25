import React from "react";
import ReactDOM from "react-dom";
import { ThemeProvider } from "styled-components";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import { theme } from "@gnosis/safe-react-components";
import Compound from "./apps/Compound";
import ENS from "./apps/ENS";
import Uniswap from "./apps/Uniswap";
import GlobalStyles from "./global";

import * as serviceWorker from "./serviceWorker";

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <GlobalStyles />
    <Router>
      <Switch>
        <Route path="/compound">
          <Compound />
        </Route>
        <Route path="/ens">
          <ENS />
        </Route>
        <Route path="/uniswap">
          <Uniswap />
        </Route>
        <Route
          path="/"
          render={() => {
            return (
              <>
                <div>
                  <Link to="/compound">Compound</Link>
                </div>
                <div>
                  <Link to="/ens">ENS</Link>
                </div>
                <div>
                  <Link to="/uniswap">Uniswap</Link>
                </div>
              </>
            );
          }}
        />
      </Switch>
    </Router>
  </ThemeProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
