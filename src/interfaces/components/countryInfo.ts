export interface ICountryInfoStateProps {

    hoverOnCountry: string;
}

export interface ICountryInfoDispatchProps {
}

export interface IMaterialUIInject {
    classes: {
        card: string;
        title: string;
    };
}

export type ICountryInfoProps =
    ICountryInfoStateProps
    & ICountryInfoDispatchProps
    & IMaterialUIInject;
