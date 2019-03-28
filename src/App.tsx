import * as React from 'react';
import {
    Route,
    Switch,
    withRouter,
} from 'react-router-dom';

import HomePage from './pages/HomePage';
import RecordJourney from './pages/RecordJourney';

const App = () => (
    <Switch>
        <Route component={HomePage} exact path="/" />
        <Route component={RecordJourney} exact path="/record-journey" />
    </Switch>
);

export default withRouter(App);
