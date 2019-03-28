import { RouteComponentProps } from 'react-router-dom';
export interface IHomePageStateProps {
}

export interface IHomePageDispatchProps {
    hoverOn: Function;
}

export type IHomePageProps = IHomePageStateProps & IHomePageDispatchProps & RouteComponentProps;
