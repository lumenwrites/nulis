import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';
import { createStore, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';

import routes from '../client/routes';
import reducers from '../client/reducers';

import App from '../client/components/App';

// Connect reduxThunk to middleware so I could dispatch async actions with axios.
const createStoreWithMiddleware = applyMiddleware(reduxThunk)(createStore);

// store contains the state
const store = createStoreWithMiddleware(reducers);

browserHistory.replace('/')

ReactDOM.render(
    <Provider store={store}>
	<Router history={browserHistory} routes={routes}/>
    </Provider>
  , document.querySelector('.app'));
