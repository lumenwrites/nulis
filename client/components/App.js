import React, { Component } from 'react';
import { connect } from 'react-redux';

/* Styles */
import '../styles/bootstrap.min.css';
import '../styles/font-awesome.min.css';
import '../styles/simplemde.min.css';
import '../styles/style.scss';

/* Vendor components */
/* import dragula from 'react-dragula'; */

/* My Components */
import Header from './Header';
import Hotkeys from './Hotkeys';



class App extends Component {
    render() {
	const { children } = this.props;
	
	return (
	    <div className="main-wrapper">
		<Header location={this.props.location} />
		{ children }
		<Hotkeys />
	    </div>
	);
    }
}

export default App;
