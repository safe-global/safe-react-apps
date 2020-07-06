import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import Compound from "./apps/Compound";
import Testing from "./apps/Testing";
import TxBuilder from "./apps/TxBuilder";
import FindMySafe from "./apps/FindMySafe";

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
        <Route path="/tx-builder">
          <TxBuilder />
        </Route>
        <Route path="/find-my-safe">
          <FindMySafe />
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
                  <Link to="/compound">Compound</Link>
                </div>
                <div>
                  <Link to="/tx-builder">Tx Builder</Link>
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
