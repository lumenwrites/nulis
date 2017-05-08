import React, { Component } from 'react';
import { connect } from 'react-redux';

/* Vendor components */
import Remarkable from 'remarkable';
import { DragSource, DragTarget } from 'react-dnd';

/* Actions */
import * as cardsActions from '../actions/cards.actions';
import {setEditing} from '../actions/trees.actions';

/* Utils */
import { getAllChildren, isActive, getParent, getCard } from '../utils/cards';
import {cardSource} from '../utils/dragAndDrop';

/* Components */
import Editor from './Editor';
import ColorBox from './ColorBox';
import DropTarget from './DropTarget';


// Use decorator to make card draggable and pass it some functions.
@DragSource('CARD', cardSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging()
}))
class Card extends Component {
    componentDidMount(){
    }

    componentDidUpdate(){
    }

    render() {
	const { card } = this.props;
	const { isDragging, connectDragSource, connectDragPreview } = this.props;
	
	var active = isActive(card, this.props.tree.cards, this.props.tree.activeCard);

	return (
	    <div key={card.id}
		 id={"card-"+card.id}
		 onDoubleClick={()=>this.props.setEditing(true)}
		 style={(card.color?{borderLeft: `3px solid ${card.color}`}:null)}
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
		<div className="add-top btn-plus"
		     onClick={() => this.props.createCard("before", card)}>+</div>
		<div className="btn collapsed-children"
		     onClick={() => this.props.createCard("before", card)}>
		    <i className="fa fa-ellipsis-v"></i>
		</div>
		
		<div className="add-right btn-plus"
		     onClick={() => this.props.createCard("right", card)}>+</div>
		<div className="add-bottom btn-plus"
		     onClick={() => this.props.createCard("after", card)}>+</div>
		<div className="btn-delete"
		     onClick={() => this.props.deleteCard(card)}>
		    &#10060;
		</div>

		<Editor card={this.props.card} />

		<ColorBox show={(this.props.tree.showCardConfig
			         && card.id == this.props.tree.activeCard) }/>
		<div className="clearfix"></div>
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


function mapStateToProps(state) {
    return { tree: state.tree.present };
}
var card = connect(mapStateToProps, {...cardsActions, setEditing})(Card);

/* Connect drag and drop to the card */
export default DragSource('CARD', cardSource, collect)(card);
