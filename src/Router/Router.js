import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import CommomLayout from "../Common/Layout";
// import Blank from '../Component/Blank';
import App from "../App";
import PeerConnection from "../Component/PeerConnection";

class Router extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact={true} path="/" component={App} />
          {/* <Route path="/blank" component={Blank} /> */}
          <Route path="/main" component={CommomLayout} />
          <Route path="/connection" component={PeerConnection} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default Router;
