import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { Globe } from '../components/globe';
import { hoverOnCountry } from '../actions/globe';
import {
    IHomePageDispatchProps,
    IHomePageProps,
    IHomePageStateProps,
} from '../interfaces/pages/homePage';
import CountryInfo from '../components/homePage/CountryInfo';
import { IState } from '../interfaces/state';
import { ICallbacks } from '../interfaces/components/globe';

const mapStateToProps = (state: IState): IHomePageStateProps => ({
});

const mapDispatchToProps = (dispatch): IHomePageDispatchProps => ({
    hoverOn: country => dispatch(hoverOnCountry(country)),
});

class HomePage extends React.Component<IHomePageProps> {
    private mount;
    private globe;

    async componentDidMount() {
        const callbacks: ICallbacks = {
            hoverOn: this.props.hoverOn,
            navigateToRecordJourney: () => this.props.history.push('record-journey'),
        };

        this.globe = new Globe(this.mount, callbacks);
        await this.globe.init();

        this.globe.start();
    }

    componentWillUnmount() {
        this.globe.cleanUp();
    }

    shouldComponentUpdate() {
        return false;
    }

    render() {
        return(
            <div
                style={{ width: window.innerWidth, height: window.innerHeight }}
                ref={(mount) => { this.mount = mount; }}
            >
                <CountryInfo />
            </div>
        );
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HomePage));
