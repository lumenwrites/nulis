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
	    <Modal className="free"
		   show={this.props.showModal =="support" ? true : false}
		   onHide={()=>this.props.setShowModal(false)}>
		<Modal.Header closeButton>
		    <h1>Support</h1>
		</Modal.Header>
		<div className="panel-modal">
		    <p>Hey there! If you have any questions, feedback, or bug reports, feel free to send me an email to <b>raymestalez@gmail.com</b>.
		    </p>
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

