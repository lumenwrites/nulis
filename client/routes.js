import React from 'react';
import {Route, IndexRoute} from 'react-router';

import App from './components/App';
import Main from './components/Main';
import Trees from './components/Trees';

import LoginForm from './components/LoginForm';
import RequireAuth from './components/auth/require_auth';

/* import PostList from './components/PostList';*/

export default (
    <Route path="/" component={App}>
	<IndexRoute component={Main} />
	<Route path="template/:template" tree="Blank" component={Main} />
	<Route path="about" tree="About" component={Main} />		
	<Route path="tree/:slug" component={Main} />
	<Route path="trees" component={Trees} />	
	<Route path="join" component={LoginForm} />
	<Route path="login" component={LoginForm} />

	<Route path="*" component={Main} />
    </Route>
)
