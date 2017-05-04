import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions/profiles';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import { browserHistory } from 'react-router';

class Login extends Component {
    componentWillMount() {
	if (this.props.authenticated) {
	    /* browserHistory.push('/');	    */
	}
    }

    onSubmit(event) {
	event.preventDefault();
	const credentials = {
	    email: ReactDOM.findDOMNode(this.refs.email).value,
	    password: ReactDOM.findDOMNode(this.refs.password).value
	};
	/* console.log("Credentials " + JSON.stringify(credentials));*/

	const { type } = this.props;
	if (type == "login") {
	    this.props.login(credentials);
	} else {
	    this.props.join(credentials);
	}
	this.props.showModal(false);
    }

    render () {

	const { type } = this.props;
	return (
	    <form className="login-form" onSubmit={this.onSubmit.bind(this)}>
		{this.props.errorMessage?
		<fieldset className="form-group">
		    <div className="alert alert-danger">
			{this.props.errorMessage}
		    </div>
		</fieldset>
		:null}
		<fieldset className="form-group">
		    { type=="login"?
		      <h1> Login </h1>
		      :
		      <h1> Create Account </h1>
		    }
		</fieldset>
		{this.props.mustLogin?
		<fieldset className="form-group">
		    <p>Unregistered users can create up to 100 cards.<br/>
			To get more cards, create an account!</p>
		</fieldset>
		:null}
		<fieldset className="form-group">
		    <label>Email:</label>
		    <input ref="email" autoFocus className="form-control" />
		</fieldset>
		<fieldset className="form-group">
		    <label>Password:</label>
		    <input ref="password" type="password" className="form-control" />
		</fieldset>
		<br/>

	    <fieldset className="form-group">		
		{ type=="login" ?
		  <button action="submit" className="btn btn-primary right">
		      Login</button>
		  :
		  <button action="submit" className="btn btn-primary right">
		      Create</button>
		}
		</fieldset>
		
	    </form>
	);
    }
}


function mapStateToProps(state) {
    return {
    	authenticated: state.profiles.authenticated
    };
}

export default connect(mapStateToProps, actions)(Login);

