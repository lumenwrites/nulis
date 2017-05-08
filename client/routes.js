import React from 'react';
import {Route, IndexRoute} from 'react-router';

import App from './components/App';
import Main from './components/Main';
import TreeManager from './components/TreeManager';

import RequireAuth from './components/auth/require_auth';

/* import PostList from './components/PostList';*/

export default (
    <Route path="/" component={App}>
	<IndexRoute component={Main} />
	<Route path="template/:template" component={Main} />
	<Route path="about" tree="About" component={Main} />
	<Route path="new" tree="Blank" component={Main} />
	<Route path="tree/:slug" component={Main} />
	<Route path="trees" component={TreeManager} />	

	<Route path="*" component={Main} />
    </Route>
)
