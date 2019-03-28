import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { IState } from '../interfaces/state';

const mapStateToProps = (state: IState): any => ({
});

const mapDispatchToProps = (dispatch): any => ({
});

class RecordJourney extends React.Component<any> {

    render() {
        return(
            <div>
                record your journey
            </div>
        );
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(RecordJourney));
