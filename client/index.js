import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, browserHistory } from 'react-router';
import { createStore, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';

import routes from './routes';
import reducers from './reducers';

// Connect reduxThunk to middleware so I could dispatch async actions with axios.
const createStoreWithMiddleware = applyMiddleware(reduxThunk)(createStore);

// store contains the state
const store = createStoreWithMiddleware(reducers);

/* Google analytics */
import settings from '../config/settings.js';
import ReactGA from "react-ga";
ReactGA.initialize(settings.googleAnalyticsCode);
function logPageView() {
    ReactGA.set({ page: window.location.pathname });
    ReactGA.pageview(window.location.pathname);
    window.scrollTo(0, 0);
}

// Sign in
const token = localStorage.getItem('token');
// if user has a token - sign him in
if (token) {
    store.dispatch({ type: 'AUTH_USER' });
    console.log("index.js: localStorage contains token, so sign user in.");  
}


ReactDOM.render(
    <Provider store={store}>
	<Router history={browserHistory} routes={routes} onUpdate={logPageView}/>
    </Provider>
  , document.querySelector('.app'));

