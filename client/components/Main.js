import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

/* Vendor components */
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

/* My Components */
import Header from './Header';
import CardGroup from './CardGroup';
import Card from './Card';
import MetaInfo from './MetaInfo';

/* Actions */
import * as cardsActions from '../actions/cards.actions';
import * as treesActions from '../actions/trees.actions';

/* Utils */
import { cardsToColumns, search } from '../utils/cards';
import handleScroll from '../utils/handleScroll';
import {unsavedWarning} from '../utils/misc';


@DragDropContext(HTML5Backend)
class Main extends Component {
    constructor(props){
	super(props);
	this.renderCards = this.renderCards.bind(this);
    }

    componentDidMount(){
	if (window.__ELECTRON_ENV__ == 'desktop'
	    && this.props.location.pathname == "/") {
	    console.log("I'm on desktop - load the blank template.");
	    this.props.loadTemplate('Blank');
	    /* Hacky way to fix initial scrolling on desktop.
	       It really should be working as is....*/
	    setTimeout(()=> {
		handleScroll(0, this.props.tree.cards);
	    }, 50);
	} else if (this.props.params && this.props.params.slug) {
	    console.log("I'm at a tree url - load the tree.");
	    this.props.loadTree(this.props.params.slug);
	} else if (this.props.params && this.props.params.template) {
	    console.log("I'm at a template url - load the template.");
	    this.props.loadTemplate(this.props.params.template);
	} else if (this.props.route && this.props.route.tree) {
	    console.log("I'm passing the template - load the template.");
	    this.props.loadTemplate(this.props.route.tree);
	} else if (this.props.user && this.props.location.pathname == "/") {
	    console.log("User is authenticated, redirecting to /trees.");
	    browserHistory.push('/trees');
	} else if (this.props.location.pathname == "/") {
	    console.log("User is not authenticated, redirecting to /about.");
	    browserHistory.push('/about');
	    this.props.loadTemplate('About');	    
	}
    }


    componentDidUpdate(pastProps, pastState) {
	var {tree, user} = this.props;
	var pastTree = pastProps.tree;
	if (this.props.params.slug !== pastProps.params.slug && this.props.params.slug) {
	    console.log("Changed the route - reload the tree.");
	    this.props.loadTree(this.props.params.slug);
	}
	if (this.props.params.template !== pastProps.params.template
	    && this.props.params.template) {
	    console.log("Changed to the template - reload the tree.");
	    this.props.loadTemplate(this.props.params.template);
	}

	if (tree.editing != pastTree.editing){
	    /* In preview vs markdown mode cards height is different, need to rescroll.*/
	    console.log("Changed preview mode, rescroll.");
	    handleScroll(tree.activeCard, tree.cards);	    
	}

	if (tree.cards != pastTree.cards && tree.saved == true) {
	    console.log("Tree has finished loading, rescroll.");
	    /* If the cards have changed, but modified is still false,
	       it means I've just loaded a tree.
	       Scrolling first card and all it's children, because
	       if active card from column 2 has no children, column 3 won't scroll. */
	    handleScroll(tree.cards.children[0].id, tree.cards);
	    handleScroll(tree.activeCard, tree.cards);
	}

	/* Asked to scroll */
	/* 
	if (this.props.tree.scroll) {
	    console.log("Updated, scroll to " + this.props.tree.activeCard);
	    handleScroll(this.props.tree.activeCard, this.props.tree.cards);
	}
	 */

	/* Warning that tree wasn't saved. */
	/* 
	if (this.props.tree.saved) {
	    window.removeEventListener('beforeunload', unsavedWarning);
	} else {
	    window.addEventListener('beforeunload', unsavedWarning);
	}
	*/

	/* When the active card changes - activate it.  */
	if (tree.activeCard != pastTree.activeCard) {
	    handleScroll(this.props.tree.activeCard, this.props.tree.cards);
	    /* Autosave tree if it's online and I'm the author.  */
	    if (tree.saved == false
		&& tree.source == "Online"
		&& tree.author == user.email) {
		this.props.updateTree(this.props.tree);
	    }
	}
    }


    /* ==== Rendering columns ==== */
    /* Loop over columns, add them to the app. */
    renderColumns(columns) {
	const {maxColumns} = this.props.preferences;

	var columnWidthDivide = columns.length-1;
	var columnCentered = false;
	if (columns.length > maxColumns) {
	    /* Maximum number of columns is 5 */
	    columnWidthDivide = maxColumns;
	}
	if (columns.length <= 3) {
	    /* If there's less than 3 columns - keep the width to 1/3rd. */
	    columnWidthDivide = 3;
	    columnCentered = true;
	}

	var mobile = window.innerWidth < 600;
	/* On mobile */
	if (mobile) {
	    columnWidthDivide = 1;
	}

	return columns.map((column, i) => {
	    return (
		<div key={i}
		     style={{width: `calc(100vw / ${columnWidthDivide})`}}
		     id={"column-" + i}
		     className={"column " + (i == 1 ? "first" : "")}>
		    <div className="blank"></div>
		    { this.renderCardGroups(column) }
		    <div className="blank"></div>
		</div>
	    );
	});
    };

    /* For each column,
       loop over card groups, append them to the column */
    renderCardGroups(column) {
	return column.map((cardGroup, i)=>{
	    return(<CardGroup key={i} group={cardGroup} renderCards={this.renderCards}/>);
	});
    }

    /* For each card group,
       loop over cards, append them to the card group.  */
    renderCards(cards){
    	var query = this.props.tree.query;

	return cards.map((card, i) => {
	    if (!search(card, query)) {
		return <div key={card.id}></div>;
	    }

	    return (
		<Card key={card.id}
		      card={card}
		      i={i}
		      activateCard={this.activateCard} />
	    );
	});
    }

    
    render() {
	const columns = cardsToColumns(this.props.tree.cards);
	/* Maximum number of columns you can see on the screen */
	const {maxColumns} = this.props.preferences;
	/* Total number of columns */
	var numberOfColumns = columns.length - 1;
	var oneColumnWidth = 100/maxColumns;
	var extraColumns = numberOfColumns - maxColumns;
	var width = "100%";
	if (numberOfColumns > maxColumns) {
	    /* If there's too many columns to fit on the screen,
	       I set with to 100% plus width of extra columns,
	       so there'll be horizontal scrolling. */
	    width = `calc(100vw + ${extraColumns*oneColumnWidth}vw)`;
	}

	/* On mobile */
	if (window.innerWidth < 600) {
	    width = `${numberOfColumns*100}vw`;
	}	
	return (
	    <div className="columns-wrapper">
		    <div className="columns"
			 style={{ width: width }}>
			{ this.renderColumns(columns) }
		    </div>
		    <MetaInfo/>
	    </div>
	);
    }
}

/* Magic connecting component to redux */
function mapStateToProps(state) {
    /* console.log("State tree " + JSON.stringify(state.tree));*/
    return {
	tree: state.tree.present,
    	user: state.profiles.user,
    	preferences: state.preferences
    };
}
/* First argument allows to access state */
/* Second allows to fire actions */
export default connect(mapStateToProps, {...cardsActions, ...treesActions})(Main);
