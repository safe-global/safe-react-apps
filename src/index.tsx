import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import Compound from "./apps/Compound";
import Uniswap from "./apps/Uniswap";
import Ens from "./apps/Ens";
import NexusMutual from "./apps/NexusMutual";
import GlobalStyles from "./global";

import * as serviceWorker from "./serviceWorker";

ReactDOM.render(
  <>
    <GlobalStyles />
    <Router>
      <Switch>
        <Route path="/compound">
          <Compound />
        </Route>
        <Route path="/uniswap">
          <Uniswap />
        </Route>
        <Route path="/nexus-mutual">
          <NexusMutual />
        </Route>
        <Route path="/ens">
          <Ens />
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
                  <Link to="/uniswap">Uniswap</Link>
                </div>
                <div>
                  <Link to="/nexus-mutual">Nexus-Mutual</Link>
                </div>
                <div>
                  <Link to="/ens">Ens</Link>
                </div>
              </>
            );
          }}
        />
      </Switch>
    </Router>
  </>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
