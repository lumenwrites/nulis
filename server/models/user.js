/* Mongoose is ORM, like models.py in django */
import mongoose, {Schema} from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt-nodejs';
import cuid from 'cuid';

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
    referralCode: {
	type: String,
	default: ""
    },
    referral: {
	type: String,
	default: ""
    },
    source: {
	type: String,
	default: ""
    },
    plan: {
	type: String,
	default: "Free"
    },
    cardLimit: {
	type: Number,
	default: 200
    },
    invited: {
	type: Number,
	default: 0
    },
    createdAt: {
	type: Date,
	default: null
    },
    stats: {
	type: JSON,
	default: {
	    calendar: []
	}
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
	this.referralCode = cuid.slug();
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
