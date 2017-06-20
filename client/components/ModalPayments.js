import React, { Component } from 'react';
import { connect } from 'react-redux';

/* Vendor */
import { Modal } from 'react-bootstrap';
import StripeCheckout from 'react-stripe-checkout';

/* Actions */
import {payment} from '../actions/profiles.actions';
import {setShowModal} from '../actions/preferences.actions';


class ModalPayments extends Component {
    sendToken(token) {
	this.props.payment(token);
	this.props.setShowModal("thankyou");
    }
    render() {
	return (
	    <Modal className="upgrade"
		   show={this.props.showModal =="upgrade" ? true : false}
		   onHide={()=>this.props.setShowModal(false)}>
		<Modal.Header closeButton>
		    <h1>Upgrade Account</h1>
		</Modal.Header>
		<div className="panel-modal">
		    <p>You are currently using a free version of Nulis,
			which allows you to create up to {this.props.user.cardLimit}
			cards per month.</p>
		    <p>Upgrade your account to create unlimited cards (both online and on desktop), get priority support, early access to new features, and help me to make this project even more awesome!</p>
		    <p>Because Nulis has launched only recently, as an early adopter
			you can purchase the unlimited lifetime account for only 
			<b> $20</b>.
		    </p>
		    <h1> Plans: </h1>
		    <div className="panel-pricing">
			<h2>Referral</h2>
			<p>Get Nulis for free</p>
			<a className="btn right"
			   onClick={()=>{
				   this.props.setShowModal("share");
			       }}>
			    Learn How
			</a>
			<div className="clearfix"></div>			
		    </div>

		    <div className="panel-pricing">
			<h2>Unlimited</h2>
			<p>$20 one-time payment</p>
			<form action="https://www.paypal.com/cgi-bin/webscr"
			      method="post" target="_top">
			    <input type="hidden" name="cmd" value="_s-xclick"/>
			    <input type="hidden" name="email"
				   value={this.props.user.email}/>	   
			    <input type="hidden" name="notify_url" 
				   value="https://nulis.io/purchase" />
			    <input type="hidden" name="hosted_button_id"
				   value="EE9L2NEJYDY4W"/>
			    <input type="button" type="submit"
				   className="btn right" value="Upgrade" />
			</form>
			<div className="clearfix"></div>			
		    </div>

   		    {/* Monthly plans with stripe  */}		    
		    {/*  
		    <div className="panel-pricing">
			<h2>Monthly</h2>
			<p> $5/month </p>
			<a className="btn right"
			   onClick={()=>{
				   this.props.payment({id:"Monthly"});
				   this.props.setShowModal("free");
			       }}>
			    Upgrade
			</a>
			<div className="clearfix"></div>			
		    </div>

		    <div className="panel-pricing">
			<h2>Yearly</h2>
			<p> $40/year (save 33.3%) </p>
			<a className="btn right"
			   onClick={()=>{
				   this.props.payment({id:"Yearly"});
				   this.props.setShowModal("free");
			       }}>
			    Upgrade
			</a>
			<div className="clearfix"></div>			
		    </div>
		    
		    <div className="panel-pricing">
			<h2>Lifetime</h2>
			<p>$150 one-time payment</p>
			<a className="btn right"
			   onClick={()=>{
				   this.props.payment({id:"Lifetime Unlimited"});
				   this.props.setShowModal("free");
			       }}>
			    Upgrade
			</a>
			<div className="clearfix"></div>			
		    </div>
		      */}
		    {/*  		    
			<div className="panel-pricing">
			<h2>Nulis Unlimited</h2>
			<StripeCheckout token={this.sendToken.bind(this)}
			stripeKey="pk_live_ARCBuuuSIJ2ATgFtXCqpISQV"
			name="Nulis"
			description="Tree editor for writers"
			panelLabel="Upgrade"
			amount={2000}
			currency="USD"
			allowRememberMe={false}
			email={localStorage.getItem('email')}
			image="https://nulis.io/media/logo.png">
			<a className="btn right">Upgrade</a>
			</StripeCheckout>
			<div className="clearfix"></div>

		    </div>
		      */}
		</div>
	    </Modal>

	)
    }
}

function mapStateToProps(state) {
    return {
    	user: state.profiles.user,
    	showModal: state.preferences.showModal
    };
}

export default connect(mapStateToProps, {payment, setShowModal})(ModalPayments);
