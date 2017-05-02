import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions/index';

import { getAllParents, getAllChildren } from '../utils/cards';

class CardGroup extends Component {
    render() {
	var activeCard = this.props.tree.activeCard;	    
	var isActive = false;

	/* If parent active */
	if (this.props.group.parent.id == activeCard) {
	    isActive = true;
	    isActive = "parents";		
	}
	/* If one of it's cards is active */
	this.props.group.cards.map((c)=>{
	    if (c.id == activeCard) {
		isActive = "group";
	    }
	})
	var allParents = getAllParents(this.props.group.parent, this.props.tree.cards);
	/* This will activate all the child groups of an active card,
	   because it checks if any of the group's parent's are active,
	   and activates the group if they are*/
	allParents.map((p)=>{
	    if (p.id == activeCard) {
		isActive = "parents";
	    }
	});

	return (
	    <div id={this.props.group.parent.id}
		 className={"card-group "
			  + (isActive =="group" ? "active" : "")
			  + (isActive =="children" ? "children-active" : "")		
			  + (isActive =="parents" ? "parents-active" : "")}>
		{ this.props.renderCards(this.props.group.cards) }
	    </div>
	);
    }
}

function mapStateToProps(state) {
    return { tree: state.tree.present };
} 
export default connect(mapStateToProps, actions)(CardGroup);
