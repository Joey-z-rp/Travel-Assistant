import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { withStyles, createStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import {
    CardContent,
    CardHeader,
    CircularProgress,
    Typography,
} from '@material-ui/core';
import {
    ICountry,
    ICountryInfoDispatchProps,
    ICountryInfoInternalState,
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
        paddingBottom: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
    },
    title: {
        fontSize: 14,
    },
    loaderContainer: {
        textAlign: 'center',
    },
});

class CountryInfo extends React.Component<ICountryInfoProps, ICountryInfoInternalState> {
    readonly state = {
        countryInfo: {} as ICountry,
        isLoading: false,
    };
    private lastSearch: string;

    async componentDidUpdate() {
        const searchFor = this.props.hoverOnCountry;

        if (searchFor && this.lastSearch !== searchFor) {
            this.updateCountryInfo(searchFor);
        }
    }

    async updateCountryInfo(searchFor: string) {
        if (!this.state.isLoading) this.setState({ isLoading: true });

        const countryInfo = await getCountryInfo(searchFor);

        if (searchFor === this.props.hoverOnCountry) {
            this.lastSearch = searchFor;
            this.setState({ countryInfo, isLoading: false });
        }
    }

    render() {
        const { classes, hoverOnCountry } = this.props;

        const content = this.state.isLoading
            ? (
                <div className={classes.loaderContainer}>
                    <CircularProgress />
                </div>
            )
            : (
                <CardContent>
                    <Typography className={classes.title} color="textSecondary">
                        Language
                    </Typography>
                    <Typography component="p">
                        {this.getCountryInfoFromArray('languages')}
                    </Typography>
                    <Typography className={classes.title} color="textSecondary">
                        Currency
                    </Typography>
                    <Typography component="p">
                        {this.getCountryInfoFromArray('currencies')}
                    </Typography>
                    <Typography className={classes.title} color="textSecondary">
                        Timezone
                    </Typography>
                    <Typography component="p">
                        {this.getCountryInfoFromArray('timezones')}
                    </Typography>
                    <Typography className={classes.title} color="textSecondary">
                        Calling Code
                    </Typography>
                    <Typography component="p">
                        {this.getCountryInfoFromArray('callingCodes')}
                    </Typography>
                </CardContent>
            );

        return hoverOnCountry
            ? (
                <Card className={classes.card}>
                    <CardHeader
                        title={hoverOnCountry}
                    />
                    {content}
                </Card>
            )
            : null;
    }

    private getCountryInfoFromArray(fieldName: string) {
        const countryInfo = this.state.countryInfo;

        return countryInfo
            && countryInfo[fieldName]
            && countryInfo[fieldName].map(item => item.name || item).join(' / ');
    }
}

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(CountryInfo)),
);

async function getCountryInfo(name: string) {
    const result = await fetch(`https://restcountries.eu/rest/v2/name/${name}`, { cache: true });
    return result[0];
}
