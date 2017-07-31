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
    console.log("Email/Pass is correct, returning token.");
    var user = req.user
    res.send({
	token: tokenForUser(user),
	email:user.email,
	plan:user.plan,
	referralCode: user.referralCode,
	cardLimit: user.cardLimit,
	stats: user.stats,		
    });
}

export function signup(req, res, next) {
    const email = req.body.email;
    const password = req.body.password;    
    const referral = req.body.referral;
    const source = req.body.source;    

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
	    console.log("Email is in use. " + email);
	    return res.status(422).send({
		error:'Email is in use'
	    });
	}

	// If a user doesn't exist - create and save user record
	const user = new User({
	    email: email,
	    password: password,
	    referral: referral,
	    source: source
	});
	if (referral) {
	    /* If user was referred, give him 100 free cards.  */
	    user.cardLimit = 300;
	    /* Find a user who invited this guy, give him cards, increase invited */
	    User.findOne({referralCode:referral}, function(err, referrer){
		if (err) { return next(err); }
		console.log("User was invited by " + referrer.email);
		referrer.cardLimit = referrer.cardLimit + 100;
		referrer.invited = referrer.invited + 1;
		referrer.save();
	    });
	}
	if (source == "rational") {
	    /* Free account link */
	    user.plan = "Lifetime Unlimited";
	}	
	user.save(function(err, user){
	    //This is a callback that's being caleld once user is saved
	    if (err) { return next(err); }
	    console.log("User successfully created! " + email);
	    /* Return the user I've just created */
	    res.send({
		token: tokenForUser(user),
		email:user.email,
		plan:user.plan,
		referralCode: user.referralCode,
	    	cardLimit: user.cardLimit,
	    	stats: user.stats,		
	    });	    
	    
	});
    });
}


export function getUser(req, res) {
    const email = req.user.email;
    console.log("Get user. " + email);
    // Search for a user with a given email
    User.findOne({email:email}, function(err, user){
	if (err) { return next(err); }
	if (!user.stats) {
	    user.stats = {
		calendar: [
		    {
			date: '2017-05-13',
			wordcount: 120
		    },{
			date: '2017-05-11',
			wordcount: 514
		    },{
			date: '2017-05-09',
			wordcount: 912
		    }
		]
	    };
	}
	res.send({
	    email:user.email,
	    plan: user.plan,
	    referralCode: user.referralCode,
	    cardLimit: user.cardLimit,
	    stats: user.stats,
	});	    
    });
}





/* Stripe payment */
export function payment(req, res) {
    console.log("Payment!");

    // Set your secret key: remember to change this to your live secret key in production
    // See your keys here: https://dashboard.stripe.com/account/apikeys
    var stripe = require("stripe")(config.stripeSecret);

    // Token is created using Stripe.js or Checkout!
    // Get the payment token submitted by the form:
    var token = req.body.id;
    console.log(JSON.stringify(req.body));
    if (token == "Monthly"
	|| token == "Yearly"
	|| token == "Lifetime Unlimited") {
	/* Surprise free account. Setting account according to the upgrade he chose. */
	User.findOne({email:req.user.email}, function(err, user){
	    if (err) { return next(err); }
	    /* Set user's plan to unlimited */
	    user.plan = token;
	    user.save(function(err, user){
		if (err) { return next(err); }
		console.log("User's plan is set to unlimited.")
		/* Return updated user */
		res.send({
		    message: "User's plan is set to unlimited.",
		    user:user
		}); 
	    });
	});
    } else {
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
}

/* Paypal payment */
export function paypal_payment(req, res) {
    console.log("Paypal Payment!");
    // Grabbing user email from paypal's payment notification
    // (I've submitted email via form)
    var email = req.params.email;
    console.log("Email " + email);    
    console.log("Paypal IPN " + JSON.stringify(req.body));
    /* Just find a user by email and upgrade his plan. */
    User.findOne({email:email}, function(err, user){
	if (err) { return next(err); }
	/* Set user's plan to unlimited */
	user.plan = "Lifetime Unlimited";
	user.save(function(err, user){
	    if (err) { return next(err); }
	    console.log("Purchase completed!  User's plan is set to unlimited.")
	    return res.status(200);
	});
    });
}


export function updateWordcount(req, res) {
    const today = req.body;
    User.findOne({email:req.user.email}, function(err, user){
	if (err) { return next(err); }
	var calendar = [];
	if (user.stats) {
	    calendar = [...user.stats.calendar];
	}
	if (calendar.length && calendar[calendar.length - 1].date == today.date) {
	    /* If the last date in user's calendar is today - update it */
	    calendar[calendar.length - 1] = today;
	    console.log("Update day.");
	} else {
	    /* Otherwise add it */
	    calendar.push(today);
	    console.log("Push day.");
	}
	/* calendar.push(today);*/


	user.stats = {
	    calendar:calendar
	};
	user.save(function(err, usr){
	    if (err) { return next(err); }
	    console.log("Updated user " + JSON.stringify(usr, null, 4));
	    var updatedToday = usr.stats.calendar[usr.stats.calendar.length - 1]
	    res.send({
		message: "Wordcount updated! " + updatedToday.wordcount
	    }); 
	});
    });
}
