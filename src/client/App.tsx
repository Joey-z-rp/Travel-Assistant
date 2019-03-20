import * as React from 'react';
import {
    Route,
    Switch,
    withRouter,
} from 'react-router-dom';

import HomePage from './pages/HomePage';

const App = () => (
    <Switch>
        <Route component={HomePage} exact path="/" />
    </Switch>
);

export default withRouter(App);
