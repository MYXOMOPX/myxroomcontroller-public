/**
 * Created by MYXOMOPX on 031 31.07.18.
 */
import {ACTION_UI_SIDEMENU_TOGGLE} from "../constants/ui.constants";


export const ActionsSideMenu = {
    toggle: () => async (dispatch) => {
        dispatch({
            type: ACTION_UI_SIDEMENU_TOGGLE
        })
    },
};