import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import * as actions from '../actions/index';
import ReactDOM from 'react-dom';

class TreeSettingsForm extends Component {
    onSubmit(event) {
	event.preventDefault();
	var name = ReactDOM.findDOMNode(this.refs.name).value;
	var tree = this.props.tree;
	tree.name = name;
	/* console.log("New name " + tree.name);*/
	this.props.saveTree(tree);
	this.props.showModal(false);
    }

    render () {
	const { type } = this.props;
	return (
	    
	    <div className="panel-modal">
		<form onSubmit={this.onSubmit.bind(this)}>
		    <label>Name:</label>
		    <input ref="name" className="form-control"
			   defaultValue={this.props.tree.name}
			   placeholder="Tree name..."
		    ></input>
		    {/*  
			<input ref="treename" className="form-control"
			value={this.props.tree.slug}></input>
		      */}
		<br/>
		<button action="submit"
			className="btn btn-primary right">
		    Save</button>
		</form>
		<button className="btn btn-danger left"
			onClick={()=>{
				this.props.deleteTree(this.props.tree);
				this.props.showModal(false);
			    }}>
		    Delete</button>

		<div className="clearfix"></div>
	    </div>
	)
    }
}



function mapStateToProps(state) {
    return {
    	tree: state.tree.present
    };
}

export default connect(mapStateToProps, actions)(TreeSettingsForm);

