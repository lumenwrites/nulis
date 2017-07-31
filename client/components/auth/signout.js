import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions/profiles';

class Signout extends Component {
    componentWillMount(){
	// as soon as it renders - login user out
	console.log(">>>> src/components/auth/signout.js:");
	console.log("Calling signoutUser action creator.");	
	this.props.signoutUser();
    }
    render(){
	return (
	    <div>Signed out!</div>
	);
    }
}

export default connect(null, actions)(Signout);
