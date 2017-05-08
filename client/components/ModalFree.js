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
		   show={this.props.showModal =="free" ? true : false}
		   onHide={()=>this.props.setShowModal(false)}>
		<Modal.Header closeButton>
		    <h1>Surprise free account!</h1>
		</Modal.Header>
		<div className="panel-modal">
		    <p>Thank you very much for deciding to purchase Nulis!</p>
		    <p>I have not implemented the payments yet, but I want to thank you for being one of the early users, so the lifetime unlimited account is yours completely free! =)</p>
		    <p>If you would still like to support this project - you can share it with your friends, or send me an email to <b>raymestalez@gmail.com</b> with some feedback or feature requests. That would really help me to make Nulis more awesome!</p>
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

