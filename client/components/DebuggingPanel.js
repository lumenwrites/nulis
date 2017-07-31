import React, { Component } from 'react';
import { connect } from 'react-redux';

import { browserHistory } from 'react-router';
import { Link } from 'react-router';

/* My Components */
/* import Header from './Header';*/

/* Actions */
import * as cardsActions from '../actions/cards.actions';
/* Utils */
/* import { getCard } from '../utils/cards';*/

class Name extends Component {
    constructor(props){
	super(props);
	/* this.showModal = this.showModal.bind(this);*/
    }

    componentWillMount() {
    }

    render () {
	const { authenticated } = this.props;

	return (
	    <div className="right debugging-header">
		{/* <a className="btn" onClick={this.createTree}>New</a> */}

		<p className="grey">Active Card Id:</p>
		<p className="small">
		    {this.props.tree.activeCard}
		</p>
		<p className="grey">Modified:</p>
		<p className="small">
		    {this.props.tree.modified}
		</p>
		<p className="grey">Debugging:</p>
		<p className="small"
		   dangerouslySetInnerHTML={{__html: this.props.tree.debugging }}>
		</p>
		<p className="grey">State:</p>
		<pre className="small hidden">
		    {JSON.stringify(this.props.tree, null, 4)}
		</pre>
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

export default connect(mapStateToProps, cardsActions)(Name);

