import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import * as actions from '../../actions/profiles';
import { Link } from 'react-router';

class Signup extends Component {
    handleFormSubmit({email, password}) {
	/* console.log(email, password);*/
	// signupUser comes from actions.
	// it is an action creator that sends an email/pass to the server
	// and if they're correct, saves the token
	var credentials = {
	    "email": email,
	    "password": password
	}
	console.log("Credentials " + JSON.stringify(credentials));

	this.props.signupUser({email,password});
    }

    renderAlert(){
	if (this.props.errorMessage) {
	    return (
		<div className="alert alert-danger">
		    {this.props.errorMessage}
		</div>
	    );
	}
    }
    render () {
	/* props from reduxForm */
	const { handleSubmit, fields: { email, password, passwordConfirm }} = this.props;
	/* console.log(...email);*/
	console.log(this.props.fields);

	
	return (
	    <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
		<fieldset className="form-group">
		    <h1> Create an account </h1>
		</fieldset>
		<fieldset className="form-group">
		    {this.renderAlert()}
		</fieldset>
		<fieldset className="form-group">
		    <label>Email:</label>
		    <input {...email} className="form-control" />
		</fieldset>
		<fieldset className="form-group">
		    <label>Password:</label>
		    <input {...password} type="password" className="form-control" />
		</fieldset>
		<br/>
		<fieldset className="form-group">
		    <Link to="/login">Have an account? Login here.</Link>
		    <button action="submit" className="btn btn-primary right">Join</button>
		</fieldset>
	    </form>
	);
    }
}

function mapStateToProps(state) {
    return { errorMessage:state.auth.error };
}

/* 
function validate(formProps) {
    const errors = {};

    if (!formProps.email) {
	errors.email = "Enter an email";	
    }

    if (!formProps.password) {
	errors.password = "Enter a password";	
    }

    return errors;
}
*/

export default connect(mapStateToProps, actions)(
    reduxForm({
	form: 'signup',
	fields: ['email','password'],
    })
    (Signup)
);
/* validate: validate */
