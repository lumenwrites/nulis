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
exports.signin = function (req, res, next) {
    // email/pass is already checked, here I just give user a token.
    // passport has already atteched user object to the request
    console.log("Email/Pass is correct, returning token ");
    res.send({token:tokenForUser(req.user), email:req.body.email});
}

exports.signup = function (req, res, next) {
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


