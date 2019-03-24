import { IGlobeState } from "../interfaces/state";
import { HOVER_ON_COUNTRY } from "../actions/globe";
import { IAction } from "../interfaces/action";

const initialState = {
    hoverOnCountry: '',
};

export default function reducer(
    state: IGlobeState = initialState,
    action: IAction,
): IGlobeState {
    switch (action.type) {
        case HOVER_ON_COUNTRY:
            return { ...state, hoverOnCountry: action.country };

        default:
            return state;
    }
}