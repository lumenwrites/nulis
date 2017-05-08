import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import ReactDOM from 'react-dom';

/* Vendor Components */
import { Modal } from 'react-bootstrap';

/* Actions */
import * as treesActions from '../actions/trees.actions';
import {setShowModal} from '../actions/preferences.actions';

class ModalTreeSettings extends Component {
    onSubmit(event) {
	event.preventDefault();
	var name = ReactDOM.findDOMNode(this.refs.name).value;
	var tree = this.props.tree;
	tree.name = name;

	this.props.updateTree(tree);
	this.props.setShowModal(false);
    }

    render () {
	return (
	    <Modal className="tree"
		   show={this.props.showModal =="tree" ? true : false}
		   onHide={()=>this.props.setShowModal(false)}>
		<Modal.Header closeButton>
		    <h1>Tree Settings</h1>
		</Modal.Header>
		<div className="panel-modal">
		    <form onSubmit={this.onSubmit.bind(this)}>
			<label>Name:</label>
			<input ref="name" className="form-control"
			       autoFocus
			       defaultValue={this.props.tree.name}
			       placeholder="Tree name...">
			</input>
			<br/>
			<button action="submit"
				className="btn btn-primary right">
			    Save
			</button>
		    </form>
		    <button className="btn btn-danger left"
			    onClick={()=>{
				    this.props.deleteTree(this.props.tree);
				    this.props.setShowModal(false);
				}}>
			Delete</button>
		    <div className="clearfix"></div>
		</div>
	    </Modal>
	)
    }
}



function mapStateToProps(state) {
    return {
    	tree: state.tree.present,
    	showModal: state.preferences.showModal	
    };
}

export default connect(mapStateToProps, {...treesActions, setShowModal})(ModalTreeSettings);

