import React, { Component } from 'react';
import { connect } from 'react-redux';

/* Vendor components */
import Remarkable from 'remarkable';
import { DragSource, DragTarget } from 'react-dnd';

/* Actions */
import * as actions from '../actions/index';

/* Utils */
import { getAllParents, getAllChildren, isActive, getParent,
	 getCard, getCardRelativeTo } from '../utils/cards';
import handleScroll from '../utils/handleScroll';

/* Components */
import Editor from './Editor';
import DropTarget from './DropTarget';


/* Drag and Drop */
/* Implements the drag source contract. */
const cardSource = {
    beginDrag(props) {
	// Return the data describing the dragged item
	const item = { cardId: props.card.id };
	return item;
    },

    endDrag(props, monitor, component) {
	const item = monitor.getItem();
	const dropResult = monitor.getDropResult();
	if (dropResult) {
	    /* Trigger this once the card is dropped */
	    var card = null;
	    var parent = null;
	    var children = null;
	    var childrenIds = null;	    	    

	    var dropIt = true;
	    card = getCard(item.cardId,props.tree.cards);
	    parent = getParent(card, props.tree.cards);
	    children = getAllChildren(card, props.tree.cards);
	    childrenIds = children.map((c)=>c.id);
	    

	    /* If I'm not dropping the card on itself
	       or on it's own parent, or on one of it's children.  */
	    if (item.cardId != dropResult.parentId
		&& !(parent.id == dropResult.parentId && dropResult.position=="right")
		&& !childrenIds.includes(dropResult.parentId)) {
		/* Trigger action that will move the card */
		/* console.log( `Dropped ${item.cardId} into ${dropResult.parentId}!`);*/
		props.dropCard(dropResult.position, dropResult.parentId, props.card);
	    } else {
		console.log("Cancel DnD. Trying to drop onto itself/parent/children.");
	    }
	}
    }
};


// Use decorator to make card draggable and pass it some functions.
@DragSource('CARD', cardSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging()
}))
class Card extends Component {
    constructor(props){
	super(props);

	this.updateTree = this.updateTree.bind(this);
    }

    renderMarkdown(markdown) {
	/* Turn markdown into html */
	const md = new Remarkable({html: true});
	markdown = md.render(markdown);
	return (
	    <div dangerouslySetInnerHTML={{__html:markdown}} />
	);
    }

    /* Handle events */
    updateTree(){
	var tree = this.props.tree;
	this.props.updateTree(tree);
	this.props.setEditing(false);
    }
    

    
    render() {
	const { card } = this.props;
	var active = isActive(card, this.props.tree.cards, this.props.tree.activeCard);
	if (active) {
	    /* console.log("Card " + card.id + " active " + active);*/
	}
	
	const { isDragging, connectDragSource, connectDragPreview } = this.props;

	var preview = (
	    <div className={"card active padding-left-10"}>
		{card.content.substring(0,30)+"..."}
	    </div>
	);

	return (
	    <div key={card.id}
	    id={"card-"+card.id}
	    onDoubleClick={()=>this.props.setEditing(true)}
	    className={"card "
		     + (active == "card" ? "active " : "")
		     + (isDragging ? "dragging " : "")		     
		     + (active == "children" ? "children-active" : "")}>
	        {connectDragSource(
		<div className="handle"></div>
		)}
	        {connectDragPreview(<div className="preview-snapshot"></div>)}
		<DropTarget position="before" card={card}/>
		<DropTarget position="after" card={card}/>
		<DropTarget position="right" card={card}/>		
		<div className="move-left temp btn-plus"
		     onClick={() => this.props.moveCard("left")}>left</div>
		<div className="move-right temp btn-plus"
		     onClick={() => this.props.moveCard("right")}>right</div>
		<div className="move-up temp btn-plus"
		     onClick={() => this.props.moveCard("up")}>up</div>
		<div className="move-down temp btn-plus"
		     onClick={() => this.props.moveCard("down")}>down</div>
		
		<div className="add-top btn-plus"
		     onClick={() => this.props.createCard("before", card)}>
			+
		</div>
		<div className="add-right btn-plus"
		     onClick={() => this.props.createCard("right", card)}>+</div>
		<div className="add-bottom btn-plus"
		     onClick={() => this.props.createCard("after", card)}>+</div>
		{/*  
		<div className="edit-card temp btn-plus"
		     onClick={() => this.props.setEditing(true)}>edit</div>
		  */}
		<div className="save-card temp btn-plus"
		     onClick={() => this.updateTree()}>save</div>
		<div className="delete-card temp btn-plus"
		     onClick={() => this.props.deleteCard()}>X</div>

		<Editor card={this.props.card} />
		<div className="debugging-info">
		    <span className="grey">
			Id:
			<span className="black">{card.id}</span>
		    </span>
		    <span className="grey">
			Parent:
			<span className="black">{getParent(card, this.props.tree.cards).id}</span>
		    </span>

		</div>
	    </div>
	);
    }
}


/* Connect Drag and Drop props to the component. */
function collect(connect, monitor) {
    return {
	connectDragSource: connect.dragSource(),
	isDragging: monitor.isDragging()
    };
}
/* Magic connecting component to redux */
function mapStateToProps(state) {
    return { tree: state.tree.present };
}
/* First argument allows to access state */
/* Second allows to fire actions */
var card = connect(mapStateToProps, actions)(Card);

/* Connect drag and drop to the card */
export default DragSource('CARD', cardSource, collect)(card);
