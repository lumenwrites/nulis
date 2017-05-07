/* Mongoose is ORM, like models.py in django */
const mongoose = require('mongoose');
const validator = require('validator');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

// Define model. 
const userSchema = new Schema({
    email: {
	type: String,
	unique: true,
	required: true,
	trim: true,
	lowercase: true,
	minlength: 1,
	validate: {
	    validator: validator.isEmail,
	    message: '{VALUE} is not a valid email'
	}
    },
    password: {
	type: String,
	required: true,
	minlength: 4
    },
    plan: {
	type: String,
	default: "Free"
    },
    createdAt: {
	type: Date,
	default: null
    }
});


// On save hook, encrypt password
// Before saving a model, run this function
userSchema.pre('save', function(next){
    // get access to the user model. User is an instance of the user model.
    const user = this;

    if (this.isNew) {
	console.log("Created new user, hashing password")
	this.createdAt = new Date();

	// generate a salt, then run callback.
	bcrypt.genSalt(10, function(err, salt){
	    if (err) { return next(err); }
	    // hash(encrypt) the password using the salt
	    bcrypt.hash(user.password, salt, null, function(err, hash){
		if (err) { return next(err); }
		// override plain text password with encrypted password
		user.password = hash;

		next();
	    });
	});
    } else {
	console.log("Updated user.")
	next();
    }
});

// This is like defining a function on the model in models.py
userSchema.methods.comparePassword = function(candidatePassword, callback) {
    /* console.log("pwd1 " + candidatePassword);*/
    /* console.log("pwd2 " + this.password);					*/
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch){
	if (err) { return callback(err); }
	console.log("isMatch " + isMatch);					
	callback(null, isMatch);
    });
};

// Create model class
const ModelClass = mongoose.model('user', userSchema);

// Export model
module.exports = ModelClass;
