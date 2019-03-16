import * as React from 'react';
import {
    Redirect,
    Route,
    Switch,
    withRouter,
} from 'react-router-dom';

import PageNotFound from './pages/PageNotFound';
import HomePage from './pages/HomePage';

const App = () => (
    <Switch>
        <Route component={HomePage} exact path="/" />
        <Route component={PageNotFound} />
    </Switch>
);

export default withRouter(App);
