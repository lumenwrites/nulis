import React, { Component } from 'react';
import { connect } from 'react-redux';

/* Styles */
import '../styles/bootstrap.min.css';
import '../styles/font-awesome.min.css';
import '../styles/simplemde.min.css';
import '../styles/style.scss';

/* My Components */
import Header from './Header';
import Hotkeys from './Hotkeys';

/* Actions */
import { fetchUser } from '../actions/profiles.actions';

class App extends Component {
    componentDidMount() {
	if (localStorage.getItem('token')){
	    this.props.fetchUser();
	}
    }

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

export default connect(null, { fetchUser })(App);
