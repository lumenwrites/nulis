import React, { Component } from 'react';
import { connect } from 'react-redux';

import Mousetrap from 'mousetrap';
import Remarkable from 'remarkable';

/* Actions */
import { createCard, updateCard, deleteCard, setActiveCard,
	 moveCard, activateCard, setEditing, selectCard,
	 updateTree, loadTree } from '../actions/index';

/* Vendor components */
import SimpleMDE from 'react-simplemde-editor';


class Editor extends Component {

    componentDidMount(){
	if (this.props.card.id == this.props.tree.activeCard
	    && this.editor && document.activeElement.className != "search") {
	    /* If the card is active - focus on it */
	    this.editor.simplemde.codemirror.focus();
	    /* And move the cursor to the end. */
	    this.editor.simplemde.codemirror.setCursor(4);
	    /* console.log(this.editor.simplemde.codemirror);*/
	}
	/* this.editor.simplemde.codemirror.options.extraKeys['Ctrl-Z'] = false;	*/

	/* Split */
	Mousetrap(document.body).bind(['ctrl+alt+j'], ()=>{
	    var cursor = this.editor.simplemde.codemirror.getCursor();
	    var doc = this.editor.simplemde.codemirror.getDoc();
	    var beforeCursor = doc.getRange({line:0,ch:0}, cursor);
	    var afterCursor = doc.getRange(cursor, {line:1000,ch:1000});	    
	    console.log("after " + afterCursor);
	    return false;
	});

    }

    componentDidUpdate(prevProps){
	if (this.editor) {
	    /* Unbind tab */
	    this.editor.simplemde.codemirror.options.extraKeys['Tab'] = false;
	    this.editor.simplemde.codemirror.options.extraKeys['Ctrl+Enter'] = false;
	    /* Experimenting with getting and setting a cursor.
	       Use it to save cursor position, or bind emacs hotkeys!! */
	    /*
	       var cursor = this.editor.simplemde.codemirror.getCursor();
	       cursor.ch = 300;
	       this.editor.simplemde.codemirror.setCursor(cursor);
	     */
	    if (this.props.card.id == this.props.tree.activeCard
		&& document.activeElement.className != "search") {
		/* Every time I switch a card - focus the editor */
		this.editor.simplemde.codemirror.focus();
	    }
	    if (this.props.card.id == this.props.tree.activeCard &&
		this.props.tree.activeCard !== prevProps.tree.activeCard &&
		this.editor.simplemde.codemirror.getCursor().ch == 0) {
		/* If I have switched cards, and this card is active,
		   and the cursor is at the beginning - move cursor to the end. */
		    this.editor.simplemde.codemirror.setCursor(4);	   
	    }
	}
    }

    renderMarkdown(markdown) {
	const { card } = this.props;
	/* Turn markdown into html */
	const md = new Remarkable({
	    html: true,
	    xhtmlOut: true,
	    breaks: true,
	    linkify: true
	});

	/* Highlight text */
	function highlight(str, find) {
	    var regexp = new RegExp(find, 'ig');
	    return str.replace(regexp, (match)=>{
		return `<span class="highlighted">${match}</span>`;
	    });
	}
	var query = this.props.tree.query;
	if (query) {
	    markdown = highlight(markdown, query);
	}
	
	/* Render checkboxes */
	var checkboxRegexp = new RegExp(/\[ \]/, 'ig')
	markdown = markdown.replace(checkboxRegexp,
				    `<span class="checkbox ${card.id}" id=${card.id}></span>`);
	checkboxRegexp = new RegExp(/\[(X|V|v)\]/, 'ig')
	markdown = markdown.replace(checkboxRegexp,
				    `<span class="checkbox ${card.id} checked" id=${card.id}></span>`);	

	var html = md.render(markdown);

	return (
	    <div dangerouslySetInnerHTML={{__html:html}} />
	);
    }


    render() {
	const { card } = this.props;
	/* if edit all, or editing this one,  */
	return (
	    <div onClick={() =>this.props.setActiveCard(card.id)}>
   	{ this.props.tree.editing ? 
	     <SimpleMDE
		 ref={(input) => { this.editor = input; }} 
		 value={card.content}
		 id={"editor-"+card.id}
		 className="text-editor mousetrap"
		 value={card.content}
		 onChange={(value) => {
			 if (value != card.content) {
			     {/* console.log("Change!") */}
			     this.props.updateCard(card, value)
			 }
		     }}
		 options={{
		     spellChecker: false,
		     height: 10,
		     autofocus: false,
		     shortcuts: {
			 "toggleFullScreen": "Alt-F",
			 "drawLink": null // unbind Ctrl+K
		     },
		     status: false,
		     placeholder: "Write here...",
		     initialValue: card.content
		 }}/>
           :
	      <div className="text-editor text-inactive">
		  {this.renderMarkdown(card.content)}
	      </div>
	   }

	    </div>

	)
	/* otherwise - render markdown */
    }
}



/* Magic connecting component to redux */
function mapStateToProps(state) {
    return { tree: state.tree.present }
}
/* First argument allows to access state */
/* Second allows to fire actions */
export default connect(mapStateToProps, { updateCard, selectCard, setActiveCard })(Editor);
