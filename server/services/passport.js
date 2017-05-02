// authentication layer, before the protected routes
// check if user is logged in before accessing controllers(which are like django views)
// So this is essentially @IsAuthenticated

const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const LocalStrategy = require('passport-local');
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/user');
const config = require('../../config/config.js');



// by default you send a POST request with username and password
// here Im telling it to use email instead
const localOptions = { usernameField: 'email'};
// Create local strategy.
const localLogin = new LocalStrategy(localOptions, function(email,password,done){
    console.log("Checking username and password. If they match - pass person in.");

    // Verify username/password
    // Call done with the user if it's correct
    // otherwise call done with false.
    User.findOne({email:email}, function(err,user){
	if (err) { return done(err); }
	/* if username not found */
	if (!user) { return done(null, false); }
	//compare passwords using the function I've defined in user model
	user.comparePassword(password, function(err, isMatch){
	    if (err) { return done(err); }
	    // if passwords don't match
	    if (!isMatch) { return done(null, false); }

	    // return user without errors
	    return done(null, user);
	});
    })
});

// Set up options for jwt strategies
//(ways to authenticate, like with token or username/password)
// tell it where to look for token
// and secret used to decode the token
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: config.secret
};

// Create JWT Strategy for token authentication
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done){
    // payload is a decoded JWT token, sub and iat from the token.
    // done is a callback, depending on whether auth is successful

    /* console.log("JWT login");*/
    // See if user id from payload exists in our database
    // If it does call 'done' with that user
    // otherwise, call 'done' without a user object
    User.findById(payload.sub, function(err, user){
	if (err) { return done(err, false); }
	/* console.log("Found user! "); */
	if (user) {
	    /* console.log("Login successful! "); */
	    done(null, user);
	} else {
	    /* console.log("Login unsuccessful =( "); */
	    done(null, false);	    
	}
    });
    
});

/* console.log("jwtLogin " + JSON.stringify(jwtLogin));*/

// Tell passport to use JWT strategy
passport.use(jwtLogin);
passport.use(localLogin);
