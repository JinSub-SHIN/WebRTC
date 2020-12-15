import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import CommomLayout from '../Common/Layout';
import Blank from '../Component/Blank';
import App from '../App';

class Router extends React.Component {
    render(){
        return(
            <BrowserRouter>
                <Switch>
                    <Route exact={true} path="/" component={App} />
                    <Route path="/blank" component={Blank} />
                    <Route path="/main" component={CommomLayout} />
                </Switch>
            </BrowserRouter>
        )
    }
}

export default Router;