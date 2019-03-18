import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { Globe } from '../utils/createGlobe';

const mapStateToProps = () => ({
});

const mapDispatchToProps = () => ({
});

class HomePage extends React.Component {
    private mount;
    private globe;

    async componentDidMount() {
        this.globe = new Globe(this.mount);
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
