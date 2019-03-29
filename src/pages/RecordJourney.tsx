import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Layout from '../components/Layout';
import MapContainer from '../components/MapContainer';
import { IState } from '../interfaces/state';

const mapStateToProps = (state: IState): any => ({
});

const mapDispatchToProps = (dispatch): any => ({
});

class RecordJourney extends React.Component<any> {

    render() {
        return(
            <Layout>
                <MapContainer />
            </Layout>
        );
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(RecordJourney));
