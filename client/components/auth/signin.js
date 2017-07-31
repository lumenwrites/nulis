import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions/profiles';
import { Link } from 'react-router';

class Login extends Component {
    onSubmit(event) {
	event.preventDefault();
	console.log('Email: ' + ReactDOM.findDOMNode(this.refs.email).value);
	const email = {email: ReactDOM.findDOMNode(this.refs.email).value};
	this.props.createSubscriber(email);

	console.log("Credentials " + JSON.stringify(credentials));
	
	this.props.loginUser({email,password});
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
	const { handleSubmit, fields: { email, password }} = this.props;

	/* console.log(...email);*/
	return (
	    <form onSubmit={this.handleFormSubmit.bind(this)}>
		<fieldset className="form-group">
		    <h1> Login </h1>
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
		    <Link to="/join">Create new account.</Link>
		    <button action="submit" className="btn btn-primary right">Sign in</button>
		</fieldset>
	    </form>
	);
    }
}


function mapStateToProps(state) {
    return {};
}

export default connect(mapStateToProps, actions)(Login);

