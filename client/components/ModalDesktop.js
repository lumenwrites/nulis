import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';

/* Vendor Components */
import { Modal } from 'react-bootstrap';

/* Actions */
import {setShowModal} from '../actions/preferences.actions';

class ModalFree extends Component {
    render() {
	return (
	    <Modal className="desktop"
		   show={this.props.showModal =="desktop" ? true : false}
		   onHide={()=>this.props.setShowModal(false)}>
		<Modal.Header closeButton>
		    <h1>Download Nulis Desktop</h1>
		</Modal.Header>
		<div className="panel-modal">
		    <p>Desktop version of Nulis is now available for
			all the platforms! <br/>
			Awesome, right? =) </p>
		    <div className="panel-download">
			<a href="/downloads/Nulis-linux-x64.zip"
			   className="btn btn-primary right">Download</a>
			<h2 className="fullheight">Linux</h2>
			<div className="clearfix"></div>			    
		    </div>

		    <div className="panel-download">
			<a href="/downloads/Nulis-darwin-x64.zip"
			   className="btn btn-primary right">Download</a>
			<h2>Mac</h2>
			<p> (Untested. Message me to report bugs.) </p>
			<div className="clearfix"></div>			    
		    </div>

		    <div className="panel-download">
			<a href="/downloads/Nulis-win32-x64.zip"
			   className="btn btn-primary right">Download</a>
			<h2>Windows</h2>
			<p> (Untested. Message me to report bugs.) </p>    
			<div className="clearfix"></div>
		    </div>

		    
		    <div className="clearfix"></div>
		</div>
	    </Modal>
	);
    }
}


function mapStateToProps(state) {
    return {
	showModal: state.preferences.showModal
    };
}

export default connect(mapStateToProps, { setShowModal })(ModalFree);

