import React, { Component } from 'react';
import { connect } from 'react-redux';

/* Actions */
import { createCard, updateCard, deleteCard,
	 moveCard, activateCard, setEditing,
	 updateTree, loadTree } from '../actions/index';

/* Vendor components */
import Textarea from 'react-textarea-autosize';


class Editor extends Component {
    componentDidMount(){
	if (this.props.card.id == this.props.tree.activeCard) {
	    this.editor.focus();
	    this.editor.selectionStart = this.props.card.content.length;	    
	    this.editor.selectionEnd= this.props.card.content.length;
	}
    }


    componentDidUpdate(prevProps){
	if (this.props.card.id == this.props.tree.activeCard &&
	    this.props.tree.activeCard !== prevProps.tree.activeCard) {
	    /* If this card is active, and the activeCard has just changed
	       - focus the editor. */
	    this.editor.focus();
	    if (this.editor.selectionStart == 0 ) {
		/* Move cursor to the end. */
		/* Will only happen if I've just changed between cards,
		   and the cursor is at the very beginning of the textarea*/
		this.editor.selectionStart= this.props.card.content.length;	    
		this.editor.selectionEnd= this.props.card.content.length;
	    }
	}
    }

    render() {
	const { card } = this.props;
	return (
	    <Textarea
		ref={(input) => { this.editor = input; }} 
		id={"editor-"+card.id}
		className="text-editor mousetrap"
		value={card.content}
		onChange={(event) =>
		    this.props.updateCard(card,event.target.value)}>
	    </Textarea>
	)
    }
}



/* Magic connecting component to redux */
function mapStateToProps(state) {
    return { tree: state.tree.present };
}
/* First argument allows to access state */
/* Second allows to fire actions */
export default connect(mapStateToProps, { updateCard })(Editor);
