import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';

/* Vendor Components */
import { Modal } from 'react-bootstrap';
import Cookies from "js-cookie";

/* Actions */
import {login,join} from '../actions/profiles.actions';
import {setShowModal} from '../actions/preferences.actions';

class ModalLogin extends Component {
    /* Note: if it's mustLogin, then I create account.  */
    onSubmit(event) {
	event.preventDefault();
	const credentials = {
	    email: ReactDOM.findDOMNode(this.refs.email).value,
	    password: ReactDOM.findDOMNode(this.refs.password).value
	};
	
	const type = this.props.showModal;
	if (type == "login") {
	    this.props.login(credentials);
	} else {
	    /* If I'm creating a new account */
	    /* Passing the cookies I've set in App.js */
	    credentials.referral = Cookies.get('referral');
	    credentials.source = Cookies.get('source');	   
	    this.props.join(credentials);
	}
	this.props.setShowModal(false);
    }

    render() {
	const type = this.props.showModal;
	return (
	    <Modal show={(type == "login" || type == "join" || type == "mustLogin") ?
			 true : false}
		   onHide={()=>this.props.setShowModal(false)}>
		<form className="login-form" onSubmit={this.onSubmit.bind(this)}>
		    {this.props.error?
		     <fieldset className="form-group">
			 <div className="alert alert-danger">
			     {this.props.error}
			 </div>
		     </fieldset>
		     :null}
		<fieldset className="form-group">
		    { type=="login" ?
		      <h1> Login </h1>
		      :
		      <h1> Create Account </h1>
		    }
		</fieldset>
		{type=="mustLogin" ?
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
	    </Modal>
	);
    }
}


function mapStateToProps(state) {
    return {
    	user: state.profiles.user,
    	error: state.profiles.error,	
	showModal: state.preferences.showModal
    };
}

export default connect(mapStateToProps, {login, join, setShowModal})(ModalLogin);

