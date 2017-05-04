import React from 'react'
import StripeCheckout from 'react-stripe-checkout';

export default class Checkout extends React.Component {
    onToken = (token) => {
	fetch('/save-stripe-token', {
	    method: 'POST',
	    body: JSON.stringify(token),
	}).then(token => {
	    alert(`We are in business, ${token.email}`);
	});
    }
    
    // ...
    
    render() {
	return (
	    <Modal className="upgrade"
		   show={this.state.showModal =="upgrade" ? true : false}
		   onHide={()=>this.showModal(false)}>
		<Modal.Header closeButton>
		    <h1>Upgrade Account</h1>
		</Modal.Header>
		<div className="panel-modal">
		    <p>You are currently using a free version of Nulis, <br/>
			which allows you to create up to 100 cards per month.</p>
		    <p>You can upgrade to the unlimited account for only $20.</p>
		    <p>Your support will help me to cover the server costs, <br/>
			and spend more time making Nulis more awesome.</p>
		    <StripeCheckout
			token={this.onToken}
			stripeKey="pk_test_C93OCodn01Awd4AzCXugSfVL"
		    />

		    <div className="panel-pricing">
			<h2>$20</h2>
			<a className="btn">Upgrade</a>
		    </div>
		    {/*  
			<div className="panel-pricing">
			<h2>Free</h2>
			<a className="btn">Share</a>
			</div>
		      */}
		<div className="clearfix"></div>
		</div>
	    </Modal>

	)
    }
}
