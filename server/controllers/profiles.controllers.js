const jwt =  require('jwt-simple');
const config = require('../../config/config.js');
const User = require('../models/user');

function tokenForUser(user){
    // sub means subject. a property describing who it is about
    // encoding it with a secret random string
    const timestamp = new Date().getTime();
    // iat - issued at time
    return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}

//sign in view
export function signin(req, res, next) {
    // email/pass is already checked, here I just give user a token.
    // passport has already atteched user object to the request
    console.log("Email/Pass is correct, returning token ");
    res.send({token:tokenForUser(req.user), email:req.body.email});
}

export function signup(req, res, next) {
    const email = req.body.email;
    const password = req.body.password;    

    if (!email || !password) {
	return res.status(422).send({
	    error:'Provide email and password'
	});
    }
    console.log("Credentials " + email);
    // Search for a user with a given email
    User.findOne({email:email}, function(err, existingUser){
	if (err) { return next(err); }

	// If a user does exit - return an error
	if (existingUser) {
	    return res.status(422).send({
		error:'Email is in use'
	    });
	}

	// If a user doesn't exist - create and save user record
	const user = new User({
	    email: email,
	    password: password
	});
	
	user.save(function(err){
	    //This is a callback that's being caleld once user is saved
	    if (err) { return next(err); }

	    // If there's no errors - user is successfully saved
	    // Send a responce indicating that user has been created
	    /* res.json(user);*/
	    //  res.send({success:'true'});
	    res.send({token: tokenForUser(user), email:email});	    
	    
	});
    });
}


export function getUser(req, res) {
    const email = req.user.email;

    // Search for a user with a given email
    User.findOne({email:email}, function(err, user){
	if (err) { return next(err); }
	res.send({
	    email:user.email,
	    plan: user.plan
	});	    
    });
}






export function payment(req, res) {
    console.log("Payment!");

    // Set your secret key: remember to change this to your live secret key in production
    // See your keys here: https://dashboard.stripe.com/account/apikeys
    var stripe = require("stripe")(config.stripeSecret);

    // Token is created using Stripe.js or Checkout!
    // Get the payment token submitted by the form:
    var token = req.body.id;
    console.log(JSON.stringify(req.body));

    // Charge the user's card:
    var charge = stripe.charges.create({
	amount: 2000,
	currency: "usd",
	description: "Example charge",
	source: token,
    }, function(err, charge) {
	if (err) { return res.status(500).send({ error:'Stripe Payment Error' })};
	/* Once payment has been processed - update the user.*/
	User.findOne({email:req.user.email}, function(err, user){
	    if (err) { return next(err); }
	    /* Set user's plan to unlimited */
	    user.plan = "Lifetime Unlimited";
	    user.save(function(err, user){
		if (err) { return next(err); }
		console.log("Purchase completed! User's plan is unlimited.")
		/* Return updated user */
		res.send({
		    message: "Purchase completed! User's plan is unlimited.",
		    user:user
		}); 
	    });
	});
    });
}
