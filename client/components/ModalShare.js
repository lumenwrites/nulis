import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';

/* Vendor Components */
import { Modal } from 'react-bootstrap';

/* Actions */
import {setShowModal} from '../actions/preferences.actions';


class ModalShare extends Component {
    render() {
	return (
	    <Modal className="free"
		   show={this.props.showModal =="share" ? true : false}
		   onHide={()=>this.props.setShowModal(false)}>
		<Modal.Header closeButton>
		    <h1>Get Nulis for Free!</h1>
		</Modal.Header>
		<div className="panel-modal">
		    <p>There are two ways to get the unlimited version of Nulis for free. </p>
		    <p>1. Share this link with your friends:</p>
		    <div className="panel-referral">
			https://nulis.io/?ref=9f183554
		    </div>
		    <p> You will get extra 100 cards for every person who signs up using this link, and they get 100 extra cards as well.<br/> If you will invite 10 people - you get a lifetime unlimited account for free.</p>
		    <p>2. Write a blog post about Nulis, send a link to <b>raymestalez@gmail.com</b> - and I will give you an unlimited account.</p>
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

export default connect(mapStateToProps, { setShowModal })(ModalShare);

