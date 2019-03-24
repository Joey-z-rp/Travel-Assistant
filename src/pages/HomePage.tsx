import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { Globe } from '../components/globe';
import { hoverOnCountry } from '../actions/globe';
import { IHomePageProps } from '../interfaces/pages/homePage';

const mapStateToProps = () => ({
});

const mapDispatchToProps = (dispatch) => ({
    hoverOn: country => dispatch(hoverOnCountry(country)),
});

class HomePage extends React.Component<IHomePageProps> {
    private mount;
    private globe;

    async componentDidMount() {
        this.globe = new Globe(this.mount, this.props.hoverOn);
        await this.globe.init();
        this.globe.start();
    }

    componentWillUnmount() {
        this.globe.cleanUp();
    }

    render() {
        return(
            <div
                style={{ width: window.innerWidth, height: window.innerHeight }}
                ref={(mount) => { this.mount = mount; }}
            />
        );
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HomePage));
