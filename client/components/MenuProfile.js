import React, { Component } from 'react';
import { connect } from 'react-redux';

import { browserHistory } from 'react-router';
import { Link } from 'react-router';

/* Actions */
import * as profilesActions from '../actions/profiles.actions';
import {setShowModal} from '../actions/preferences.actions';

class MenuProfile extends Component {
    renderUserMenu() {
	return(
	    <ul className="dropdown-menu">
		<li className="hidden" key="accountprefs">
		    <a onClick={this.props.logout}>
			Preferences
		    </a>
		</li>
		{this.props.user.plan == "Free" ?
		 <li  className="" key="upgrade">
		     <a  onClick={()=>this.props.setShowModal("upgrade")}>
			 Upgrade Account
		     </a>
		 </li> : null}
		<hr/>
		<li key="logout">
		    <a onClick={this.props.logout}>
			Logout
		    </a>
		</li>
	    </ul>
	);
    }

    renderLoginMenu(){
	return(
	    <ul className="dropdown-menu">
		<li key="login">
		    <a onClick={()=>this.props.setShowModal("login")}>
			Login
		    </a>
		</li>
		<li key="join">
		    <a onClick={()=>this.props.setShowModal("join")}>
			Create Account
		    </a>
		</li>
	    </ul>
	);
    }
    render () {
	return (
	    <span className="dropdown">
		<a className="btn">Profile</a>
		{ this.props.user ?
		  this.renderUserMenu()
		  :
		  this.renderLoginMenu()
		}
	    </span>
	);
    }
}


function mapStateToProps(state) {
    return {
	tree: state.tree.present,
    	user: state.profiles.user
    };
}

export default connect(mapStateToProps, {...profilesActions, setShowModal})(MenuProfile);

