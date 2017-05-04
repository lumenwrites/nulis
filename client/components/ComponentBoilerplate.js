import React, { Component } from 'react';
import { connect } from 'react-redux';

import { browserHistory } from 'react-router';
import { Link } from 'react-router';

/* My Components */
/* import Header from './Header';*/

/* Actions */
import * as actions from '../actions/index';
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
	    <div>
	    </div>
	);
    }
}


function mapStateToProps(state) {
    return {
	tree: state.tree.present,
    	authenticated: state.profiles.authenticated
    };
}

export default connect(mapStateToProps, actions)(Name);

