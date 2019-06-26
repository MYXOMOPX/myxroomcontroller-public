import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux';
import {mainLightReducer} from "./main-light.reducer";
import {uiReducer} from "./ui.reducer";

export const rootReducer = combineReducers({
    routing: routerReducer,
    mainLight: mainLightReducer,
    ui: uiReducer
});