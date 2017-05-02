import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions/index';

import { DropTarget } from 'react-dnd';

const dropTarget = {
    drop(props) {
	/* Return the info I'll be ale to access after the card is dropped.  */
	return {
	    parentId: props.card.id,
	    position:props.position
	};
    },
};
@DropTarget('CARD', dropTarget, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop()
}))
class Target extends Component {
    render() {
	const { canDrop, isOver, isDragging, connectDropTarget } = this.props;
	/* console.log("Drop target props " + JSON.stringify(this.props));*/
	/* Highlight it */
	var isActive = canDrop && isOver;
	/* if (isOver) { console.log("Over."); } */
	return connectDropTarget(
	    <div className={"drop-target "
			  + (isActive ? "active " : " ")
			  + (canDrop ? "dragging " : " ")		
			  + this.props.position}>

	    </div>
	);
    }
}


export default Target;

