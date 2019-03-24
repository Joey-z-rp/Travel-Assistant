export interface ICountryInfoStateProps {
    classes?: {
        card: string;
    };
    hoverOnCountry: string;
}

export interface ICountryInfoDispatchProps {
}

export type ICountryInfoProps = ICountryInfoStateProps & ICountryInfoDispatchProps;
