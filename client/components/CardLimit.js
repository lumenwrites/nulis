import React, { Component } from 'react';
import { connect } from 'react-redux';

import { browserHistory } from 'react-router';
import { Link } from 'react-router';

/* Actions */
import * as cardsActions from '../actions/cards.actions';
import {setShowModal} from '../actions/preferences.actions';

class CardLimit extends Component {
    componentDidUpdate(pastProps, pastState) {
	/* If user has created a card - check if he's reached the limit.*/
	if (this.props.tree.cards != pastProps.tree.cards
	    && this.props.tree.saved == false
	    && this.props.location.pathname != "/trees") {

	    /* If unauthenticated user reached a limit - open must login prompt. */
	    /* Checking it using localStorage,
	       otherwise it pops up before user is fetched. */
	    if(!localStorage.getItem('token')
	       && localStorage.getItem('cardsCreated') > 100){
		this.props.setShowModal("mustLogin");
	    }

	    /* If free user reached a limit - open upgrade prompt. */
	    if (this.props.user.plan == "Free"
		&& localStorage.getItem('cardsCreated') > this.props.user.cardLimit){
		this.props.setShowModal("upgrade");
	    }
	}
    }


    renderLimitIndicator() {
	var cardsCreated = 0;
	if (localStorage.getItem('cardsCreated')) {
	    cardsCreated = localStorage.getItem('cardsCreated');
	}

	if (!localStorage.getItem('token')) {
	    /* If the user isn't logged in - opens must login prompt. */
	    return (
		<div className="progress-outer"
		     onClick={()=>this.props.setShowModal("mustLogin")}>
		    <div className="progress-inner"
			 style={{"width" : `${cardsCreated}%`}}>
		    </div>
		</div>		    
	    )
	}
	if (this.props.user.plan == "Free") {
	    /* Making sure user is on Free account, opening upgrade prompt.*/
	    return (
		<div className="progress-outer"
		     onClick={()=>this.props.setShowModal("upgrade")}>
		    <div className="progress-inner"
			 style={{"width" : `${(cardsCreated/this.props.user.cardLimit)*100}%`}}>
		    </div>
		</div>		    
	    )
	}

	return null;
    }

    render() {
	return(
	    <div className="left">
	    {this.renderLimitIndicator()}
	    </div>
	);
    }
}


function mapStateToProps(state) {
    return {
	tree: state.tree.present,
    	user: state.profiles.user
    };
}

export default connect(mapStateToProps, {setShowModal})(CardLimit);

