
export interface ILayoutInternalState {
    open: boolean;
}

export interface ILayoutStateProps {
}

export interface ILayoutDispatchProps {
}

export interface IMaterialUIInject {
    classes: {
        root: string;
        appBar: string;
        appBarShift: string;
        appBarHeader: string;
        drawer: string;
        container: string;
    };
}

export type ILayoutProps =
    ILayoutStateProps
    & ILayoutDispatchProps
    & IMaterialUIInject;
