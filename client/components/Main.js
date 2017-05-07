import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

/* Vendor components */
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import MetaTags from 'react-meta-tags';
import removeMd from 'remove-markdown';

/* My Components */
import Header from './Header';
import CardGroup from './CardGroup';
import Card from './Card';
import Hotkeys from './Hotkeys';

/* Actions */
import * as actions from '../actions/index';

/* Utils */
import { getCard, cardsToColumns, getAllParents, getAllChildren, search } from '../utils/cards';
import handleScroll, { scrollTo  } from '../utils/handleScroll';

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

	} else if (this.props.route && this.props.route.tree) {
	    console.log("I'm passing the template - load the template.");
	    this.props.loadTemplate(this.props.route.tree);
	} else if (this.props.authenticated && this.props.location.pathname == "/") {
	    console.log("User is authenticated, redirecting to /trees.");
	    browserHistory.push('/trees');
	} else if (this.props.location.pathname == "/") {
	    console.log("User is not authenticated, redirecting to /about.");
	    browserHistory.push('/about');
	    this.props.loadTemplate('About');	    
	}

	/* 
	if (localStorage.getItem('tree')) {
	    console.log("Loading autosaved tree");
	    this.props.loadLocalTree();
	}
	*/
    }

    componentDidUpdate(pastProps, pastState) {
	if (this.props.params.slug !== pastProps.params.slug && this.props.params.slug) {
	    console.log("Changed the route - reload the tree.");
	    this.props.loadTree(this.props.params.slug);
	}

	if (this.props.tree.editing != pastProps.tree.editing){
	    /* In preview vs markdown mode cards height is different,
	       so gotta rescroll*/
	    console.log("Changed preview mode, rescroll.");
	    handleScroll(this.props.tree.activeCard, this.props.tree.cards);	    
	}

	if (this.props.tree.cards != pastProps.tree.cards
	    && this.props.tree.modified == false) {
	    console.log("Tree has finished loading, rescroll.");
	    /* console.log(JSON.stringify(this.props.tree, null, 4));	    */
	    /* If the cards have changed, but modified is still false,
	       it means I've just loaded a tree.
	       Scrolling first card and all it's children, because
	       if active card from column 2 has no children, column 3 won't scroll. */
	    handleScroll(this.props.tree.cards.children[0].id, this.props.tree.cards);
	    handleScroll(this.props.tree.activeCard, this.props.tree.cards);
	}

	/* Asked to scroll */
	/* 
	if (this.props.tree.scroll) {
	    console.log("Updated, scroll to " + this.props.tree.activeCard);
	    handleScroll(this.props.tree.activeCard, this.props.tree.cards);
	}
	 */
	
	/* When the active card changes - activate it.  */
	if (this.props.tree.activeCard != pastProps.tree.activeCard) {
	    /* console.log("Active card changed " + this.props.tree.activeCard);*/
	    handleScroll(this.props.tree.activeCard, this.props.tree.cards);
	    this.props.autosaveTree(this.props.tree);
	    /* Autosave if I'm logging, I'm an author, and it's already in the db  */
	    if (this.props.authenticated
		&& this.props.tree.author == localStorage.getItem('email')) {
		console.log("Active card changed, autosaving.");
		this.props.saveTree(this.props.tree);		
	    }
	}
    }



    /* ==== Rendering columns ==== */
    /* Loop over columns, add them to the app. */
    renderColumns(columns) {
	var maxColumns = 5;

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

    renderMetaInfo () {
	const tree = this.props.tree;

	var title = "Nulis";
	if (tree.name) {
	    title = tree.name + " - Nulis";
	}
	const description = removeMd(tree.cards.children[0].content).substring(0,120);	

	return (
            <MetaTags>
		{/* Main */}
		<title>{title}</title>
		<meta name="description"
		      content={description} />
		{/* Facebook */}
		<meta property="og:title" content={title} />
		<meta property="og:description" content={description} />	
		{/* Twitter */}
		<meta property="twitter:description" content={description}/>
            </MetaTags>
	);
    }
    
    
    render() {
	const columns = cardsToColumns(this.props.tree.cards);

	var width = "100%";	
	if (columns.length > 5) {
	    /* If there's more than 5 columns,
	       the width will be 100% plus width of extra columns,
	       so there'll be horizontal scrolling. */
	    width = `calc(100vw + ${(columns.length-6)*20}vw)`;
	}

	/* On mobile */
	if (window.innerWidth < 600) {
	    width = `${(columns.length-1)*100}vw`;
	}	
	return (
	    <div className="columns-wrapper">
		    <div className="columns"
			 style={{ width: width }}>
			{ this.renderColumns(columns) }
		    </div>
		    {this.renderMetaInfo()}
	    </div>
	);
    }
}

/* Magic connecting component to redux */
function mapStateToProps(state) {
    /* console.log("State tree " + JSON.stringify(state.tree));*/
    return { tree: state.tree.present,
    	     authenticated: state.profiles.authenticated};
}
/* First argument allows to access state */
/* Second allows to fire actions */
export default connect(mapStateToProps, actions)(Main);
