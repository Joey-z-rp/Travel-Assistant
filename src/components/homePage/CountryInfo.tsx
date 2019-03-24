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
import fetch from '../../utils/fetch';


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
    title: {
        fontSize: 14,
    },
});

class CountryInfo extends React.Component<ICountryInfoProps> {
    readonly state = { countryInfo: {} };
    private lastSearch: string;

    async componentDidUpdate() {
        const searchFor = this.props.hoverOnCountry;
        if (searchFor && this.lastSearch !== searchFor) {
            const countryInfo = (await fetch(`https://restcountries.eu/rest/v2/name/${searchFor}`))[0];
            if (searchFor === this.props.hoverOnCountry) {
                this.lastSearch = searchFor;
                this.setState({ countryInfo });
            }
        }
        
    }

    render() {
        const { classes, hoverOnCountry } = this.props;

        return hoverOnCountry 
            ? (
                <Card className={classes.card}>
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                            {hoverOnCountry}
                        </Typography>
                        <Typography className={classes.title} color="textSecondary">
                            Currency
                        </Typography>
                        <Typography component="p">
                            {this.state.countryInfo.currencies && this.state.countryInfo.currencies[0].name}
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