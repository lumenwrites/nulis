import React, { Component } from 'react';
import { connect } from 'react-redux';

import { browserHistory } from 'react-router';
import { Link } from 'react-router';

/* My Components */
/* import Header from './Header';*/

/* Actions */
import {deleteCard} from '../actions/cards.actions';
import {setShowModal} from '../actions/preferences.actions';

import { ActionCreators } from 'redux-undo';
var { undo, redo } = ActionCreators;

class MenuEdit extends Component {
    render () {
	return (
	    <span className="dropdown">
		<a className="btn">Edit</a>
		<ul className="dropdown-menu">
		    <li key="undo">
			<a onClick={this.props.undo}>
			    Undo
			    <span className="label label-default right">
				Ctrl+Z
			    </span>
			</a> 
		    </li>
		    <li key="redo">
			<a onClick={this.props.redo}>
			    Redo
			    <span className="label label-default right">
				Ctrl+Shift+Z
			    </span>
			</a> 
		    </li>
		    <li key="delete">
			<a onClick={this.props.deleteCard}>
			    Delete Card
			    <span className="label label-default right">
				Ctrl+Bksp
			    </span>
			</a>
		    </li>
		    <hr/>
		    {/* Show tree settings only to the author,
			checking source just in case. */}
		    {this.props.user
		     && this.props.user.email == this.props.tree.author
		     && this.props.tree.source == "Online" ?
		     <li key="settings">
			 <a onClick={()=>this.props.setShowModal("tree")}>
			     Tree Settings
			 </a> 
		     </li>
		     : null}
		<hr/>
		<li className="hidden" key="prefs">
		    <a onClick={this.saveFile}>
			Nulis Preferences
		    </a> 
		</li>
		</ul>
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

export default connect(mapStateToProps, {deleteCard, undo, redo, setShowModal})(MenuEdit);

