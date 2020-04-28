import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import Aave from "./apps/Aave";
import Compound from "./apps/Compound";
import PoolTogether from "./apps/PoolTogether";
import Request from "./apps/Request";
import Synthetix from "./apps/Synthetix";
import Testing from "./apps/Testing";
import OpenZeppelin from "./apps/OpenZeppelin";
import GlobalStyles from "./global";

import * as serviceWorker from "./serviceWorker";

ReactDOM.render(
  <>
    <GlobalStyles />
    <Router>
      <Switch>
        <Route path="/aave">
          <Aave />
        </Route>
        <Route path="/compound">
          <Compound />
        </Route>
        <Route path="/pool-together">
          <PoolTogether />
        </Route>
        <Route path="/open-zeppelin">
          <OpenZeppelin />
        </Route>
        <Route path="/request">
          <Request />
        </Route>
        <Route path="/synthetix">
          <Synthetix />
        </Route>
        <Route path="/testing">
          <Testing />
        </Route>
        <Route
          path="/"
          render={() => {
            return (
              <>
                <div>
                  <Link to="/aave">Aave</Link>
                </div>
                <div>
                  <Link to="/compound">Compound</Link>
                </div>
                <div>
                  <Link to="/open-zeppelin">OpenZeppelin</Link>
                </div>
                <div>
                  <Link to="/pool-together">PoolTogether</Link>
                </div>
                <div>
                  <Link to="/request">Request</Link>
                </div>
                <div>
                  <Link to="/synthetix">Synthetix</Link>
                </div>
                <div>
                  <Link to="/testing">Testing</Link>
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
