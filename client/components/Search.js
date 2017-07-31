import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';

import { browserHistory } from 'react-router';
import { Link } from 'react-router';

/* My Components */

/* Actions */
import * as treesActions from '../actions/trees.actions';

class Search extends Component {
    componentDidMount(){
	/* Shortcuts */
	/* Focus on search */
	Mousetrap(document.body).bind(['ctrl+/'], ()=>{
	    ReactDOM.findDOMNode(this.refs.search).focus();	    
	    return false;
	});
    }

    render () {
	return (
	    <span className="">
		<input className="search" ref="search"
		       value={this.props.query}
		       onChange={(event)=>
			   this.props.updateSearchQuery(event.target.value)}/>
		<i className="fa fa-search"/>
	    </span>
	);
    }
}

function mapStateToProps(state) {
    return {
	query: state.tree.present.query
    };
}

export default connect(mapStateToProps, treesActions)(Search);

