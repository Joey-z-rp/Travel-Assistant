export interface ICountryInfoInternalState {
    countryInfo: any;
    isLoading: boolean;
}

export interface ICountryInfoStateProps {

    hoverOnCountry: string;
}

export interface ICountryInfoDispatchProps {
}

export interface IMaterialUIInject {
    classes: {
        card: string;
        title: string;
        loaderContainer: string;
    };
}

export type ICountryInfoProps =
    ICountryInfoStateProps
    & ICountryInfoDispatchProps
    & IMaterialUIInject;
