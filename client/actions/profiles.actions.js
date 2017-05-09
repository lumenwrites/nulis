import axios from 'axios';
import { browserHistory } from 'react-router';

import {API_URL} from './cards.actions';


export function fetchUser() {
    const config = {
	headers:  { authorization: localStorage.getItem('token')}
    };

    /* console.log("profiles.actions:");*/
    /* console.log("Fetching user.");*/
    return function(dispatch) {
	axios.get(`${API_URL}/auth/profile`, config)
	     .then(response => {
		 /* console.log("profiles.actions:");*/
		 console.log("Fetched user " + JSON.stringify(response.data));
		 dispatch({
		     type: 'AUTH_USER',
		     payload: response.data
		 });
	     });
    }
}


export function login(credentials) {
    return function(dispatch) {
	/* console.log("profiles.actions:");*/
	/* console.log("Sending email and password.");*/
	axios.post(`${API_URL}/auth/login`, credentials)
	     .then(response => {
		 /* console.log("profiles.actions:");*/
		 /* console.log("Sign in successful."); */
		 /*console.log("Saving user to state, saving token to local storage.");*/
		 console.log("Fetched user " + JSON.stringify(response.data));
		 dispatch({
		     type: 'AUTH_USER',
		     payload: response.data
		 });
		 localStorage.setItem('token', response.data.token);
		 console.log("Redirecting to /");
		 browserHistory.push('/trees');
	     })
	     .catch((err) => {
		 if (err) {
		     console.log("profiles.actions:");
		     console.log("Login error " + err);
		     dispatch({
			 type: 'AUTH_ERROR',
			 payload: "Authentication error"
		     });
		 }
	     })

    };
}


export function join(credentials) {
    return function(dispatch) {
	console.log("profiles.actions:");
	console.log("Sending email and password.");
	console.log("ref " + credentials.referral);
	console.log("src " + credentials.source);	
	axios.post(`${API_URL}/auth/join`, credentials)
	     .then(response => {
		 console.log("profiles.actions:");
		 console.log("Created user.");		 
		 console.log("Saving user to state, saving JWT token to local storage.");
		 dispatch({
		     type: 'AUTH_USER',
		     payload: response.data
		 });
		 localStorage.setItem('token', response.data.token);

		 console.log("Redirecting to /");
		 browserHistory.push('/trees');
	     })
	     .catch((err) => {
		 if (err) {
		     console.log("profiles.actions:");
		     console.log("Could not create user. " + err);
		     dispatch({
			 type: 'AUTH_ERROR',
			 payload: "Authentication error"
		     });
		 }
	     })

    };
}



export function logout() {
    // delete token and signout
    /* console.log("profiles.actions:");*/
    console.log("Logging out.")
    /* console.log("Removing token from local storage, removing user from state.");*/
    localStorage.removeItem('token');
    localStorage.removeItem('cardsCreated');    
    return {
	type: 'UNAUTH_USER'
    };

    console.log("Redirecting to /.");
    browserHistory.push('/');    
}



export function payment(token) {
    const config = {
	headers:  { authorization: localStorage.getItem('token')}
    };
    console.log("profiles.actions:");
    console.log(`Sending payment token.`);
    return function(dispatch) {
	axios.post(`${API_URL}/purchase`, token, config)
	     .then(response => {
		 console.log("Payment successful");
		 console.log("Plan: " + response.data.user.plan);
		 console.log(`Saving updated user to the state.`);		 
		 dispatch({
		     type: 'AUTH_USER',
		     payload: response.data.user
		 });
	     });
    }
}
