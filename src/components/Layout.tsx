import classNames from 'classnames';
import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
    AppBar,
    Button,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Typography,
} from '@material-ui/core';
import { createStyles, withStyles } from '@material-ui/core/styles';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MenuIcon from '@material-ui/icons/Menu';
import { IState } from '../interfaces/state';

const drawerWidth = 200;

const style = createStyles({
    root: {
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
    },
    appBar: {
        transitionDuration: '200ms',
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
    },
    appBarHeader: {
        flexGrow: 1,
        marginLeft: 10,
    },
    drawer: {
        width: drawerWidth,
    },
    container: {
        flexGrow: 1,
        position: 'relative',
    },
});

const mapStateToProps = (state: IState): any => ({
});

const mapDispatchToProps = (dispatch): any => ({
});

class Layout extends React.Component<any> {
    state = {
        open: false,
    };

    toggleDrawer = () => {
        this.setState({ open: !this.state.open });
    }

    render() {
        const { classes } = this.props;
        const { open } = this.state;

        return(
            <React.Fragment>
                <div className={classes.root}>
                    <AppBar
                        position="static"
                        className={classNames(
                            classes.appBar,
                            { [classes.appBarShift]: open },
                        )}
                    >
                        <Toolbar>
                            <IconButton
                                color="inherit"
                                aria-label="Toggle drawer"
                                onClick={this.toggleDrawer}
                            >
                                <MenuIcon />
                            </IconButton>
                            <Typography
                                className={classes.appBarHeader}
                                variant="h6"
                                color="inherit"
                                noWrap
                            >
                                Record your journey
                            </Typography>
                            <Button color="inherit">Login</Button>
                        </Toolbar>
                    </AppBar>
                    <Drawer
                        className={classes.drawer}
                        variant="persistent"
                        anchor="left"
                        open={open}
                        classes={{ paper: classes.drawer }}
                    >
                        <List>
                            <ListItem button>
                                <ListItemIcon>
                                    <InboxIcon />
                                </ListItemIcon>
                                <ListItemText primary="Record" />
                            </ListItem>
                        </List>
                    </Drawer>
                    <main className={classes.container}>
                        {this.props.children}
                    </main>
                </div>
            </React.Fragment>
        );
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(style)(Layout)));
