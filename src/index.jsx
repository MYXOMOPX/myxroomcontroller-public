import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux'

import './style/style.scss'
import {getStore, history} from './store/store.config'
import {App} from "./components/mobile/App";
import {Route} from "react-router";
import { MuiThemeProvider } from '@material-ui/core/styles';
import {getTheme} from "./material-design/theme";
import { ConnectedRouter } from 'connected-react-router'

const store = getStore();
const theme = getTheme();
render((
    <MuiThemeProvider theme={theme}>
        <Provider store={store}>
            <ConnectedRouter history={history}>
                <Route path="/" component={App} />
            </ConnectedRouter>
        </Provider>
    </MuiThemeProvider>
),document.getElementById('root'));











