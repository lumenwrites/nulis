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
		   show={this.props.showModal =="thankyou" ? true : false}
		   onHide={()=>this.props.setShowModal(false)}>
		<Modal.Header closeButton>
		    <h1>Thank you!</h1>
		</Modal.Header>
		<div className="panel-modal">
		    <p>Thank you so much for your support! =)
			I really hope that Nulis will be very useful to you.</p>
		    <p>If you have any questions, issues, or would like to
			suggest a feature - always feel free to send me an email to
			<b> raymestalez@gmail.com</b></p>
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

