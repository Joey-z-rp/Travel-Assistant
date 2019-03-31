import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Layout from '../components/Layout';
import MapContainer from '../components/MapContainer';
import { getCountryInfo } from '../components/homePage/CountryInfo';
import { IState } from '../interfaces/state';

const mapStateToProps = (state: IState): any => ({
    initialCountry: state.globe.hoverOnCountry,
});

const mapDispatchToProps = (dispatch): any => ({
});

class RecordJourney extends React.Component<any> {
    state = { initialCenter: {} }
    async componentDidMount() {
        const countryInfo = await getCountryInfo(this.props.initialCountry);
        this.setState({ initialCenter: { lat:countryInfo.latlng[0], lng: countryInfo.latlng[1] } });
    }

    render() {
        return(
            <Layout>
                <MapContainer initialCenter={this.state.initialCenter} />
            </Layout>
        );
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(RecordJourney));
