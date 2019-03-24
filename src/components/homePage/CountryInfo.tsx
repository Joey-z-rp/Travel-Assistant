import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { withStyles, createStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import {
    ICountryInfoDispatchProps,
    ICountryInfoProps,
    ICountryInfoStateProps,
} from '../../interfaces/components/countryInfo';
import { IState } from '../../interfaces/state';

const mapStateToProps = (state: IState): ICountryInfoStateProps => ({
    hoverOnCountry: state.globe.hoverOnCountry,
});

const mapDispatchToProps = (dispatch): ICountryInfoDispatchProps => ({
});

const styles = createStyles({
    card: {
        maxWidth: 200,
        position: 'absolute',
        left: 0,
        top: 0,
        margin: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
    },
});

class CountryInfo extends React.Component<ICountryInfoProps> {
    render() {
        const { classes, hoverOnCountry } = this.props;

        return hoverOnCountry 
            ? (
                <Card className={classes.card}>
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                            {hoverOnCountry}
                        </Typography>
                        <Typography component="p">
                            Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging
                            across all continents except Antarctica
                        </Typography>
                    </CardContent>
                </Card>
            )
            : null;
    }
}

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(CountryInfo))
);