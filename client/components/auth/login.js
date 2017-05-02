import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions/profiles';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';

class Login extends Component {
    onSubmit(event) {
	event.preventDefault();
	const credentials = {
	    email: ReactDOM.findDOMNode(this.refs.email).value,
	    password: ReactDOM.findDOMNode(this.refs.password).value
	};
	console.log("Credentials " + JSON.stringify(credentials));

	const { path } = this.props.route;
	if (path == "login") {
	    this.props.login(credentials);
	} else {
	    this.props.join(credentials);
	}
    }

    render () {
	const { path } = this.props.route;
	return (
	    <form onSubmit={this.onSubmit.bind(this)}>
		{this.props.errorMessage?
		<fieldset className="form-group">
		    <div className="alert alert-danger">
			{this.props.errorMessage}
		    </div>
		</fieldset>
		:null}
		<fieldset className="form-group">
		    { path=="login"?
		      <h1> Login </h1>
		      :
		      <h1> Create Account </h1>
		    }
		</fieldset>
		<fieldset className="form-group">
		    <label>Email:</label>
		    <input ref="email" className="form-control" />
		</fieldset>
		<fieldset className="form-group">
		    <label>Password:</label>
		    <input ref="password" type="password" className="form-control" />
		</fieldset>
		<br/>
		<fieldset className="form-group">
		    { path=="login" ?
		      <Link to="/join">Don't have an account? Join here.</Link>
		      :
		      <Link to="/login">Have an account? Login here.</Link>
		    }
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

