import {ACTION_UI_SIDEMENU_TOGGLE} from "../constants/ui.constants";
const initialState = {
    sideMenuOpened: false,
};

export function uiReducer(state = initialState, action){
    if (action.type === ACTION_UI_SIDEMENU_TOGGLE) {
        return {...state, sideMenuOpened: !state.sideMenuOpened}
    }
    return state;
}