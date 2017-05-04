(function(e, a) { for(var i in a) e[i] = a[i]; }(exports, /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 18);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("mongoose");

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("passport");

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
    secret: 'secret-key',
    domain: 'https://nulis.io',
    stripeSecret: 'sk_test_zpfqWohjcsr8b1whSZBXvMvn'
};

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/* Mongoose is ORM, like models.py in django */
var mongoose = __webpack_require__(1);
var validator = __webpack_require__(27);
var Schema = mongoose.Schema;
var bcrypt = __webpack_require__(19);

// Define model. 
var userSchema = new Schema({
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
			}

});

// On save hook, encrypt password
// Before saving a model, run this function
userSchema.pre('save', function (next) {
			// get access to the user model. User is an instance of the user model.
			var user = this;

			// generate a salt, then run callback.
			bcrypt.genSalt(10, function (err, salt) {
						if (err) {
									return next(err);
						}
						// hash(encrypt) the password using the salt
						bcrypt.hash(user.password, salt, null, function (err, hash) {
									if (err) {
												return next(err);
									}
									// override plain text password with encrypted password
									user.password = hash;
									next();
						});
			});
});

// This is like defining a function on the model in models.py
userSchema.methods.comparePassword = function (candidatePassword, callback) {
			bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
						if (err) {
									return callback(err);
						}
						callback(null, isMatch);
			});
};

// Create model class
var ModelClass = mongoose.model('user', userSchema);

// Export model
module.exports = ModelClass;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// authentication layer, before the protected routes
// check if user is logged in before accessing controllers(which are like django views)
// So this is essentially @IsAuthenticated

var passport = __webpack_require__(2);
var JwtStrategy = __webpack_require__(6).Strategy;
var LocalStrategy = __webpack_require__(23);
var ExtractJwt = __webpack_require__(6).ExtractJwt;
var User = __webpack_require__(4);
var config = __webpack_require__(3);

// by default you send a POST request with username and password
// here Im telling it to use email instead
var localOptions = { usernameField: 'email' };
// Create local strategy.
var localLogin = new LocalStrategy(localOptions, function (email, password, done) {
				console.log("Checking username and password. If they match - pass person in.");

				// Verify username/password
				// Call done with the user if it's correct
				// otherwise call done with false.
				User.findOne({ email: email }, function (err, user) {
								if (err) {
												return done(err);
								}
								/* if username not found */
								if (!user) {
												return done(null, false);
								}
								//compare passwords using the function I've defined in user model
								user.comparePassword(password, function (err, isMatch) {
												if (err) {
																return done(err);
												}
												// if passwords don't match
												if (!isMatch) {
																return done(null, false);
												}

												// return user without errors
												return done(null, user);
								});
				});
});

// Set up options for jwt strategies
//(ways to authenticate, like with token or username/password)
// tell it where to look for token
// and secret used to decode the token
var jwtOptions = {
				jwtFromRequest: ExtractJwt.fromHeader('authorization'),
				secretOrKey: config.secret
};

// Create JWT Strategy for token authentication
var jwtLogin = new JwtStrategy(jwtOptions, function (payload, done) {
				// payload is a decoded JWT token, sub and iat from the token.
				// done is a callback, depending on whether auth is successful

				/* console.log("JWT login");*/
				// See if user id from payload exists in our database
				// If it does call 'done' with that user
				// otherwise, call 'done' without a user object
				User.findById(payload.sub, function (err, user) {
								if (err) {
												return done(err, false);
								}
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

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = require("passport-jwt");

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = __webpack_require__(0);

var router = new _express.Router();

var passport = __webpack_require__(2);
var passportService = __webpack_require__(5);

var requireAuth = passport.authenticate('jwt', { session: false });
var requireSignin = passport.authenticate('local', { session: false });

var profilesControllers = __webpack_require__(15);

// Make every request go through the passport profilesentication check:
router.route('/auth-test').get(requireAuth, function (req, res) {
    console.log("req " + JSON.stringify(req.user));
    res.send({ message: 'Successfully accessed protected API!' });
});

/* Take a request from a url and send a response. */
router.route('/auth/join').post(profilesControllers.signup);
router.route('/auth/login').post(requireSignin, profilesControllers.signin);

router.route('/auth/profile').get(requireAuth, profilesControllers.getUser);
router.route('/purchase').post(requireAuth, profilesControllers.payment);

exports.default = router;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = __webpack_require__(0);

var _tree = __webpack_require__(16);

var treeControllers = _interopRequireWildcard(_tree);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var router = new _express.Router();

var passport = __webpack_require__(2);
var passportService = __webpack_require__(5);
var requireAuth = passport.authenticate('jwt', { session: false });

router.route('/trees').get(requireAuth, treeControllers.listTrees);
router.route('/trees').post(requireAuth, treeControllers.createTree);
router.route('/tree/:slug').get(treeControllers.getTree);
router.route('/tree/:slug').post(requireAuth, treeControllers.updateTree);
router.route('/tree/:slug').delete(requireAuth, treeControllers.deleteTree);

exports.default = router;

/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = require("body-parser");

/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = require("cors");

/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = require("http");

/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = require("morgan");

/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = require("util");

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
				value: true
});
exports.signin = signin;
exports.signup = signup;
exports.getUser = getUser;
exports.payment = payment;
var jwt = __webpack_require__(22);
var config = __webpack_require__(3);
var User = __webpack_require__(4);

function tokenForUser(user) {
				// sub means subject. a property describing who it is about
				// encoding it with a secret random string
				var timestamp = new Date().getTime();
				// iat - issued at time
				return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}

//sign in view
function signin(req, res, next) {
				// email/pass is already checked, here I just give user a token.
				// passport has already atteched user object to the request
				console.log("Email/Pass is correct, returning token ");
				res.send({ token: tokenForUser(req.user), email: req.body.email });
}

function signup(req, res, next) {
				var email = req.body.email;
				var password = req.body.password;

				if (!email || !password) {
								return res.status(422).send({
												error: 'Provide email and password'
								});
				}
				console.log("Credentials " + email);
				// Search for a user with a given email
				User.findOne({ email: email }, function (err, existingUser) {
								if (err) {
												return next(err);
								}

								// If a user does exit - return an error
								if (existingUser) {
												return res.status(422).send({
																error: 'Email is in use'
												});
								}

								// If a user doesn't exist - create and save user record
								var user = new User({
												email: email,
												password: password
								});

								user.save(function (err) {
												//This is a callback that's being caleld once user is saved
												if (err) {
																return next(err);
												}

												// If there's no errors - user is successfully saved
												// Send a responce indicating that user has been created
												/* res.json(user);*/
												//  res.send({success:'true'});
												res.send({ token: tokenForUser(user), email: email });
								});
				});
}

function getUser(req, res) {
				var email = req.user.email;

				// Search for a user with a given email
				User.findOne({ email: email }, function (err, user) {
								if (err) {
												return next(err);
								}
								res.send({
												email: user.email,
												plan: user.plan
								});
				});
}

function payment(req, res) {
				console.log("Payment!");

				// Set your secret key: remember to change this to your live secret key in production
				// See your keys here: https://dashboard.stripe.com/account/apikeys
				var stripe = __webpack_require__(26)(config.stripeSecret);

				// Token is created using Stripe.js or Checkout!
				// Get the payment token submitted by the form:
				var token = req.body.id;
				console.log(JSON.stringify(req.body));

				// Charge the user's card:
				var charge = stripe.charges.create({
								amount: 2000,
								currency: "usd",
								description: "Example charge",
								source: token
				}, function (err, charge) {
								if (err) {
												return res.status(500).send({ error: 'Stripe Payment Error' });
								};
								/* Once payment has been processed - update the user.*/
								User.findOne({ email: req.user.email }, function (err, user) {
												if (err) {
																return next(err);
												}
												/* Set user's plan to unlimited */
												user.plan = "Lifetime Unlimited";
												user.save(function (err, user) {
																if (err) {
																				return next(err);
																}
																console.log("Purchase completed! User's plan is unlimited.");
																/* Return updated user */
																res.send({
																				message: "Purchase completed! User's plan is unlimited.",
																				user: user
																});
												});
								});
				});
}

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getTree = getTree;
exports.deleteTree = deleteTree;
exports.listTrees = listTrees;
exports.createTree = createTree;
exports.updateTree = updateTree;

var _fs = __webpack_require__(21);

var _fs2 = _interopRequireDefault(_fs);

var _removeMarkdown = __webpack_require__(24);

var _removeMarkdown2 = _interopRequireDefault(_removeMarkdown);

var _cuid = __webpack_require__(20);

var _cuid2 = _interopRequireDefault(_cuid);

var _slug = __webpack_require__(25);

var _slug2 = _interopRequireDefault(_slug);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Tree = __webpack_require__(17);

function getTree(req, res, next) {
    var slug = req.params.slug;
    console.log("Get tree " + slug);
    /* Find a tree by id, and send it as a respponse */
    Tree.findOne({ slug: slug }, function (err, tree) {
        if (err) {
            return next(err);
        }
        /* console.log("tree " + tree);*/
        return res.send(tree);
    });
}

/* Delete a tree  */
function deleteTree(req, res) {
    if (!req.params) {
        res.status(500).end();
    }

    var slug = req.params.slug;
    console.log("Deleting tree.");
    Tree.findOne({ slug: slug }).exec(function (err, tree) {
        if (t.author != req.user.email) {
            res.status(401).end();
        }
        if (err) {
            res.status(500).send(err);
        }
        console.log("Deleted tree " + tree.slug);
        tree.remove(function () {
            res.status(200).end();
        });
    });
}

function listTrees(req, res, next) {
    console.log('List trees ' + req.user.email);
    /* Return the list of all trees */
    Tree.find({ author: req.user.email }).then(function (allTrees) {
        console.log('all trees' + JSON.stringify(allTrees));
        return res.send(allTrees);
    });
}

/* 
export function listTemplates (req, res, next) {
    var AboutTemplate = JSON.parse(fs.readFileSync('../assets/trees/about.nls', 'utf8'));
    var BlankTemplate = JSON.parse(fs.readFileSync('../assets/trees/blank.nls', 'utf8'));
    var StoryStructureTemplate = JSON.parse(fs.readFileSync('../assets/trees/story.nls', 'utf8'));

    var templates = [AboutTemplate, BlankTemplate, StoryStructureTemplate]
    return res.send(templates);
}
*/

function createTree(req, res, next) {
    /* Getting the tree from the POST request sent to me by react */
    var tree = req.body;
    console.log("Creating tree. Received from react: " + JSON.stringify(tree));
    if (!tree.name) {
        /* If I haven't set a name - set it to the first line */
        var firstCard = tree.cards.children[0];
        var firstLine = firstCard.content.split('\n')[0];
        tree.name = (0, _removeMarkdown2.default)(firstLine);
        if (!tree.name) {
            tree.name = "Empty";
        }
    }
    /* Create slug - just slugify name */
    tree.slug = (0, _slug2.default)(tree.name) + "-" + _cuid2.default.slug();
    /* Set tree's author to email passed to me by the passport */
    tree.author = req.user.email;
    tree = new Tree(tree);

    console.log("Creating new tree: " + tree.name);
    tree.save(function (err, tree) {
        if (err) {
            return next(err);
        }
        console.log("New tree created.");
        return res.send(tree);
    });
}

function updateTree(req, res, next) {
    /* Getting the tree from the POST request sent to me by react */
    var tree = req.body;

    var options = { upsert: true, new: true, setDefaultsOnInsert: true };
    /* Find a tree by id and create it if it doesn't exist */
    Tree.findOne({ slug: tree.slug }, function (err, t) {
        if (t.author != req.user.email) {
            res.status(401).end();
        }
        if (err) {
            return next(err);
        }
        /* If tree does exist - update it. */
        console.log("Updating tree. Received from react: " + JSON.stringify(tree));
        Tree.findOneAndUpdate({ slug: tree.slug }, tree, function (err, t) {
            if (err) {
                return next(err);
            }
            /* console.log("Updated tree! " + JSON.stringify(t));*/
            return res.send(tree);
        });
    });
}

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/* Mongoose is ORM, like models.py in django */
var mongoose = __webpack_require__(1);
var Schema = mongoose.Schema;

// Define model. 
var treeSchema = new Schema({
			slug: {
						type: String,
						unique: true,
						required: true,
						lowercase: true,
						index: true
			},
			author: {
						type: String,
						required: true,
						lowercase: true,
						index: true
			},
			name: {
						type: String,
						unique: false,
						required: true,
						minlength: 1,
						trim: true,
						index: true
			},
			createdAt: {
						type: Number,
						default: null
			},
			updatedAt: {
						type: Number,
						default: null
			},
			cards: {
						type: JSON,
						unique: false,
						required: false,
						minlength: 1
			},
			activeCard: {
						type: String,
						default: 0
			},
			modified: {
						type: Boolean,
						default: false
			},
			editing: {
						type: Boolean,
						default: false
			}
});
/*
   owner: ownerId or email?
*/

treeSchema.set('autoIndex', false);

// Create model class
var TreeModel = mongoose.model('tree', treeSchema);

// Export model
module.exports = TreeModel;

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(__dirname) {

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = __webpack_require__(0);

var _express2 = _interopRequireDefault(_express);

var _http = __webpack_require__(11);

var _http2 = _interopRequireDefault(_http);

var _bodyParser = __webpack_require__(9);

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _morgan = __webpack_require__(12);

var _morgan2 = _interopRequireDefault(_morgan);

var _mongoose = __webpack_require__(1);

var _mongoose2 = _interopRequireDefault(_mongoose);

var _cors = __webpack_require__(10);

var _cors2 = _interopRequireDefault(_cors);

var _path = __webpack_require__(13);

var _path2 = _interopRequireDefault(_path);

var _util = __webpack_require__(14);

var _util2 = _interopRequireDefault(_util);

var _profilesRoutes = __webpack_require__(7);

var _profilesRoutes2 = _interopRequireDefault(_profilesRoutes);

var _treesRoutes = __webpack_require__(8);

var _treesRoutes2 = _interopRequireDefault(_treesRoutes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Connect to db.


/* Routes */
// Cors allows requests from different domains
// A logging framework, terminal output for debugging.
_mongoose2.default.Promise = global.Promise; // manipulate filepaths
// ORM between mongo and node.
// Parse requests, turn them into json

var MONGO_DB_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/nulis';
console.log("Connecting to the db at " + MONGO_DB_URL);
_mongoose2.default.connect(MONGO_DB_URL, function (error) {
    if (error) {
        console.error('Please make sure Mongodb is installed and running!');
        throw error;
    }
});

/* Setup server */
var server = new _express2.default();
server.use(_bodyParser2.default.json({ type: '*/*' }));
server.use((0, _cors2.default)());
/* server.use(morgan('combined'));*/

/* API */
server.use('/api/v1', _profilesRoutes2.default);
server.use('/api/v1', _treesRoutes2.default);

/* Serve static files */
server.use('/media', _express2.default.static(_path2.default.resolve(__dirname, '../client/media')));
server.use('/downloads', _express2.default.static(_path2.default.resolve(__dirname, '../desktop/packages')));
server.get('/bundle.js', function (req, res) {
    res.sendFile(_path2.default.resolve(__dirname, '../client/dist/bundle.js'));
});

/* Send the rest of the requests to be handled by the react router */
server.use(function (req, res) {
    return res.sendFile(_path2.default.resolve(__dirname, '../client/index.html'));
});

// start server
var port = process.env.PORT || 3000;
server.listen(port, function (error) {
    if (!error) {
        console.log('Server is running on port ' + port + '!');
    } else {
        console.error('Couldnt start server!');
    }
});

exports.default = server;
/* WEBPACK VAR INJECTION */}.call(exports, ""))

/***/ }),
/* 19 */
/***/ (function(module, exports) {

module.exports = require("bcrypt-nodejs");

/***/ }),
/* 20 */
/***/ (function(module, exports) {

module.exports = require("cuid");

/***/ }),
/* 21 */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),
/* 22 */
/***/ (function(module, exports) {

module.exports = require("jwt-simple");

/***/ }),
/* 23 */
/***/ (function(module, exports) {

module.exports = require("passport-local");

/***/ }),
/* 24 */
/***/ (function(module, exports) {

module.exports = require("remove-markdown");

/***/ }),
/* 25 */
/***/ (function(module, exports) {

module.exports = require("slug");

/***/ }),
/* 26 */
/***/ (function(module, exports) {

module.exports = require("stripe");

/***/ }),
/* 27 */
/***/ (function(module, exports) {

module.exports = require("validator");

/***/ })
/******/ ])));