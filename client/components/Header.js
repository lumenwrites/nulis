import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { browserHistory } from 'react-router';

/* Vendor */
import Mousetrap from 'mousetrap';
import removeMd from 'remove-markdown';


/* Actions */
import * as cardsActions from '../actions/cards.actions';
import * as treesActions from '../actions/trees.actions';
import {fetchUser, logout} from '../actions/profiles.actions';
import {setShowModal} from '../actions/preferences.actions';
import { ActionCreators } from 'redux-undo';
var { undo, redo } = ActionCreators;

/* My Components */
/* Modals */
import ModalLogin from './ModalLogin';
/* import ModalTreeSettings from './ModalTreeSettings';*/
import ModalPayments from './ModalPayments';
import ModalThankYou from './ModalThankYou';
import ModalFree from './ModalFree';
import ModalShare from './ModalShare';
import ModalDesktop from './ModalDesktop';
import ModalSupport from './ModalSupport';
import ModalTreeSettings from './ModalTreeSettings';
/* Menus */
import MenuTree from './MenuTree';
import MenuEdit from './MenuEdit';
import MenuProfile from './MenuProfile';
import MenuAbout from './MenuAbout';

import CardLimit from './CardLimit';
import Search from './Search';
import Stats from './Stats';

class Header extends Component {
    render() {
	const atMyTrees = this.props.location.pathname == "/trees";
	const isDesktop = window.__ELECTRON_ENV__ == 'desktop';
	
	return (
	    <div className="header">
		<ModalTreeSettings />
		<ModalLogin />
		<ModalPayments />
		<ModalThankYou />				
		<ModalFree />
		<ModalShare />
		<ModalDesktop />
		<ModalSupport />				
		
		<div className="main-menu left">
		    <MenuTree location={this.props.location}/>
		    { !atMyTrees ?
		    <MenuEdit  location={this.props.location} />
		    :null}
		    <MenuProfile />
		    <MenuAbout />
		    <Stats />

		    {atMyTrees?
		     <h1>My Trees</h1>
		     :
		     <h1>{this.props.tree.name}</h1>
		    }
	        {!atMyTrees
		 && this.props.user
		 && this.props.user.email == this.props.tree.author
		 && this.props.tree.source == "Online"
		 && this.props.tree.saved ?
		 <span className="autosaved left">
		     [saved]
		 </span>
		 : null
		}
		<CardLimit location={this.props.location} />
		</div>

		<div className={"stats " + (atMyTrees ? "hidden":"")}>
		    <Search />
		</div>
		{/* <DebuggingPanel/>*/}
		<div className="clearfix"></div>
	    </div>
	);
    }
}


function mapStateToProps(state) {
    return {
	tree: state.tree.present,
	user: state.profiles.user,
	preferences: state.preferences
    };
}

export default connect(mapStateToProps, {...cardsActions, ...treesActions,
					 fetchUser, logout, undo, redo,
					 setShowModal})(Header);
