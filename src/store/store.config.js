import {rootReducer} from '../reducers/root.reducer.js'
import thunk from 'redux-thunk';
import { createHashHistory} from 'history'
import { applyMiddleware, compose, createStore } from 'redux'
import { connectRouter, routerMiddleware } from 'connected-react-router'

export const history = createHashHistory();

export function getStore() {

    const reducers = connectRouter(history)(rootReducer);
    const middlewares = compose(applyMiddleware(
        routerMiddleware(history),
        thunk,
    ));
    return createStore(reducers, middlewares);
}
