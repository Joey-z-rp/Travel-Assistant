import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
    AppBar,
    Button,
    IconButton,
    Toolbar,
    Typography,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { IState } from '../interfaces/state';
import MapContainer from '../components/MapContainer';

const mapStateToProps = (state: IState): any => ({
});

const mapDispatchToProps = (dispatch): any => ({
});

class RecordJourney extends React.Component<any> {

    render() {
        return(
            <React.Fragment>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton color="inherit" aria-label="Menu">
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" color="inherit" style={{ flexGrow: 1, marginLeft: 10 }}>
                            Record your journey
                        </Typography>
                        <Button color="inherit">Login</Button>
                    </Toolbar>
                </AppBar>
                <MapContainer />
            </React.Fragment>
        );
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(RecordJourney));
