import axios from 'axios';
import { browserHistory } from 'react-router';

import {API_URL} from './index';


export function login({email, password}) {
    return function(dispatch) {
	// send email/password
	// .then - success, .catch - fail.
	console.log(">>>> src/actions/auth.js:");		
	console.log("Sending POST request from signinUser.");
	/* console.log("Email: " + email);
	   console.log("Password: " + password);	*/
	var credentials = {
	    "email": email,
	    "password": password
	}	
	axios.post(`${API_URL}/auth/login`, credentials)
	     .then(response => {
		 console.log("Successfully signed in!");
		 // if request is good
		 // - update state to indicate that I'm signed in
		 dispatch({
		     type: 'AUTH_USER',
		     payload: response.data.email
		 });
		 console.log("Auth action dispatched(to flip auth state to true)");
		 // - save JWT token
		 localStorage.setItem('token', response.data.token);
		 localStorage.setItem('email', response.data.email);		 
		 console.log("Token saved! " + response.data.token);
		 // - redirect to /feature
		 browserHistory.push('/');
		 console.log("Redirected to /");		 

	     })
	     .catch(() => {
		 // if request is bad
		 dispatch(authError('Bad Login Info'));
	     })

    };
}


export function join({email, password}) {
    return function(dispatch) {
	// send email/password
	// .then - success, .catch - fail.
	var credentials = {
	    "email": email,
	    "password": password
	}
	/* console.log("Credentials " + JSON.stringify(credentials));*/
	axios.post(`${API_URL}/auth/join`, credentials)
	     .then(response => {
		 console.log("Returned ");
		 // if request is good
		 // - update state to indicate that I'm signed up
		 dispatch({ type: 'AUTH_USER'});
		 // - save JWT token
		 console.log("Returned token " + response.data.token);
		 localStorage.setItem('token', response.data.token);
		 localStorage.setItem('email', response.data.email);		 
		 // - redirect to /feature
		 browserHistory.push('/');
	     })
	     .catch(() => {
		 // if request is bad - add error to the state.
		     dispatch(authError('Authentication error.'));
	     })

    };
}



export function logout() {
    // delete token and signout
    console.log(">>>> src/actions/auth.js:");
    console.log("Signing out user, deleting token from localStorage.");		    
    localStorage.removeItem('token');
    console.log("Redirecting to /, and dispatching action UNAUTH_USER.");
    browserHistory.push('/');    
    return {
	type: 'UNAUTH_USER'
    };
}

export function authError(error) {
    return {
	type: 'AUTH_ERROR',
	payload: error
    };
}

export function fetchMessage() {
    const config = {
	headers:  { authorization: localStorage.getItem('token')}
    };
    
    return function(dispatch) {
	axios.get('http://localhost:3000/api/v1/auth-test', config)
	     .then(response => {
		 console.log("Auth test " + JSON.stringify(response));
		 dispatch({
		     type: 'FETCH_MESSAGE',
		     payload: response.data.message
		 });
	     });
    }
}



export function fetchUser() {
    const config = {
	headers:  { authorization: localStorage.getItem('token')}
    };
    
    return function(dispatch) {
	axios.get(`${API_URL}/auth/profile`, config)
	     .then(response => {
		 console.log(`Returned User! ` + JSON.stringify(response.data));
		 dispatch({
		     type: 'UPDATE_USER',
		     payload: response.data
		 });
	     });
    }
}

export function payment(token) {
    const config = {
	headers:  { authorization: localStorage.getItem('token')}
    };
    
    return function(dispatch) {
	axios.post(`${API_URL}/purchase`, token, config)
	     .then(response => {
		 console.log(`Payment processed!`);
		 dispatch({
		     type: 'UPDATE_USER',
		     payload: response.data.user
		 });
	     });
    }
}
