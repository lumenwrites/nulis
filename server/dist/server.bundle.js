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
/******/ 	return __webpack_require__(__webpack_require__.s = 21);
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

module.exports = require("cuid");

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("passport");

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
				value: true
});
exports.getTree = getTree;
exports.exportTree = exportTree;
exports.deleteTree = deleteTree;
exports.listTrees = listTrees;
exports.createTree = createTree;
exports.updateTree = updateTree;

var _fs = __webpack_require__(23);

var _fs2 = _interopRequireDefault(_fs);

var _removeMarkdown = __webpack_require__(9);

var _removeMarkdown2 = _interopRequireDefault(_removeMarkdown);

var _cuid = __webpack_require__(2);

var _cuid2 = _interopRequireDefault(_cuid);

var _slug = __webpack_require__(26);

var _slug2 = _interopRequireDefault(_slug);

var _cards = __webpack_require__(18);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Tree = __webpack_require__(20);

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

function forEachChild(root, fun) {
				root.children.map(function (c) {
								fun(c, root);
								if (c.children) {
												forEachChild(c, fun);
								}
				});
}

function exportTree(req, res, next) {
				var slug = req.params.slug;

				/* Find a tree by id, and send it as a respponse */
				Tree.findOne({ slug: slug }, function (err, tree) {
								if (err || !tree) {
												return res.status(404).end();
								}
								console.log("Exporting tree " + tree.slug);

								var markdown = "";

								if (req.query.column) {
												var columns = (0, _cards.cardsToColumns)(tree.cards);
												var columnNumber = parseInt(req.query.column) - 1;
												console.log("Exporting column " + columnNumber);
												if (columns[columnNumber]) {
																columns[columnNumber].cardGroups.map(function (cardGroup) {
																				cardGroup.cards.map(function (card) {
																								markdown += card.content + "\n\n";
																				});
																});
												}
								} else if (req.query.subtree) {
												console.log("Exporting card's children " + tree.activeCard);
												var card = (0, _cards.getCard)(tree.activeCard, tree.cards);
												markdown += card.content + "\n\n";
												forEachChild(card, function (c) {
																markdown += c.content + "\n\n";
												});
								} else {
												console.log("Exporting the whole tree");
												forEachChild(tree.cards, function (c) {
																markdown += c.content + "\n\n";
												});
								}

								res.setHeader('content-type', 'text/plain');
								return res.end(markdown);
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
								if (tree.author != req.user.email) {
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
				Tree.find({ author: req.user.email }).sort('-updatedAt').then(function (allTrees) {
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
				console.log("Creating tree. Received from react: " + tree.name);
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
				console.log("Updating tree. " + tree.slug);
				var options = { upsert: true, new: true, setDefaultsOnInsert: true };
				/* Find a tree by id and create it if it doesn't exist */
				Tree.findOne({ slug: tree.slug }, function (err, t) {
								if (!t.author || t.author != req.user.email) {
												res.status(401).end();
								}
								if (err) {
												return next(err);
								}
								/* If tree does exist - update it. */
								console.log("Updating tree. Received from react: " + JSON.stringify(tree));
								tree.updatedAt = new Date();
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
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
    secret: 'secret-key',
    domain: 'https://nulis.io',
    stripeSecret: 'sk_live_HvJdtCSh7gmkvraqc05bUieI'
};

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _mongoose = __webpack_require__(1);

var _mongoose2 = _interopRequireDefault(_mongoose);

var _validator = __webpack_require__(28);

var _validator2 = _interopRequireDefault(_validator);

var _bcryptNodejs = __webpack_require__(22);

var _bcryptNodejs2 = _interopRequireDefault(_bcryptNodejs);

var _cuid = __webpack_require__(2);

var _cuid2 = _interopRequireDefault(_cuid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Define model. 
/* Mongoose is ORM, like models.py in django */
var userSchema = new _mongoose.Schema({
			email: {
						type: String,
						unique: true,
						required: true,
						trim: true,
						lowercase: true,
						minlength: 1,
						validate: {
									validator: _validator2.default.isEmail,
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
			}
});

// On save hook, encrypt password
// Before saving a model, run this function
userSchema.pre('save', function (next) {
			// get access to the user model. User is an instance of the user model.
			var user = this;

			if (this.isNew) {
						console.log("Created new user, hashing password");
						this.createdAt = new Date();
						this.referralCode = _cuid2.default.slug();
						// generate a salt, then run callback.
						_bcryptNodejs2.default.genSalt(10, function (err, salt) {
									if (err) {
												return next(err);
									}
									// hash(encrypt) the password using the salt
									_bcryptNodejs2.default.hash(user.password, salt, null, function (err, hash) {
												if (err) {
															return next(err);
												}
												// override plain text password with encrypted password
												user.password = hash;

												next();
									});
						});
			} else {
						console.log("Updated user.");
						next();
			}
});

// This is like defining a function on the model in models.py
userSchema.methods.comparePassword = function (candidatePassword, callback) {
			/* console.log("pwd1 " + candidatePassword);*/
			/* console.log("pwd2 " + this.password);					*/
			_bcryptNodejs2.default.compare(candidatePassword, this.password, function (err, isMatch) {
						if (err) {
									return callback(err);
						}
						console.log("isMatch " + isMatch);
						callback(null, isMatch);
			});
};

// Create model class
var ModelClass = _mongoose2.default.model('user', userSchema);

// Export model
module.exports = ModelClass;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// authentication layer, before the protected routes
// check if user is logged in before accessing controllers(which are like django views)
// So this is essentially @IsAuthenticated

var passport = __webpack_require__(3);
var JwtStrategy = __webpack_require__(8).Strategy;
var LocalStrategy = __webpack_require__(25);
var ExtractJwt = __webpack_require__(8).ExtractJwt;
var User = __webpack_require__(6);
var config = __webpack_require__(5);

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
												console.log("User not found. " + email);
												return done(null, false);
								}

								//compare passwords using the function I've defined in user model
								user.comparePassword(password, function (err, isMatch) {
												if (err) {
																return done(err);
												}
												// if passwords don't match
												if (!isMatch) {
																console.log("Passwords don't match. ");
																console.log(email);
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
												console.log("JWT login successful! ");
												done(null, user);
								} else {
												console.log("JWT Login unsuccessful. Probably wrong JWT. ");
												done(null, false);
								}
				});
});

/* console.log("jwtLogin " + JSON.stringify(jwtLogin));*/

// Tell passport to use JWT strategy
passport.use(jwtLogin);
passport.use(localLogin);

/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = require("passport-jwt");

/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = require("remove-markdown");

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = __webpack_require__(0);

var router = new _express.Router();

var passport = __webpack_require__(3);
var passportService = __webpack_require__(7);

var requireAuth = passport.authenticate('jwt', { session: false });
var requireSignin = passport.authenticate('local', { session: false });

var profilesControllers = __webpack_require__(19);

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
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = __webpack_require__(0);

var _tree = __webpack_require__(4);

var treeControllers = _interopRequireWildcard(_tree);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var router = new _express.Router();

var passport = __webpack_require__(3);
var passportService = __webpack_require__(7);
var requireAuth = passport.authenticate('jwt', { session: false });

router.route('/trees').get(requireAuth, treeControllers.listTrees);
router.route('/trees').post(requireAuth, treeControllers.createTree);
router.route('/tree/:slug').get(treeControllers.getTree);
router.route('/tree/:slug').post(requireAuth, treeControllers.updateTree);
router.route('/tree/:slug').delete(requireAuth, treeControllers.deleteTree);

exports.default = router;

/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = require("body-parser");

/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = require("cors");

/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = require("http");

/***/ }),
/* 15 */
/***/ (function(module, exports) {

module.exports = require("morgan");

/***/ }),
/* 16 */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),
/* 17 */
/***/ (function(module, exports) {

module.exports = require("util");

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
			value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.forEachChild = forEachChild;
exports.immutableCopy = immutableCopy;
exports.getCard = getCard;
exports.getParent = getParent;
exports.getAllParents = getAllParents;
exports.getAllChildren = getAllChildren;
exports.getCardRelativeTo = getCardRelativeTo;
exports.getCardByPosition = getCardByPosition;
exports.getSiblings = getSiblings;
exports.getCardsPosition = getCardsPosition;
exports.getCardsColumn = getCardsColumn;
exports.getFirstChildren = getFirstChildren;
exports.isActive = isActive;
exports.insertCard = insertCard;
exports.createCard = createCard;
exports.selectCard = selectCard;
exports.moveCard = moveCard;
exports.dropCard = dropCard;
exports.updateCard = updateCard;
exports.deleteCard = deleteCard;
exports.sortByKey = sortByKey;
exports.cardsToColumns = cardsToColumns;
exports.search = search;

var _cuid = __webpack_require__(2);

var _cuid2 = _interopRequireDefault(_cuid);

var _removeMarkdown = __webpack_require__(9);

var _removeMarkdown2 = _interopRequireDefault(_removeMarkdown);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* Apply a function to every child of a card.
   Return the list of updated children. */
function forEachChild(root, fun) {
			/* console.log("root " + JSON.stringify(root, null, 4));*/
			/* Return updated children */
			return root.children.map(function (c) {
						/* Recursively do this for all the child's children;*/
						var updatedChildren = forEachChild(c, fun);
						c.children = updatedChildren;

						/* Apply function to this child. */
						/* Passing it the root, which represents child's parent, in case you need it,
         so you can do forEachChild(root, (child, itsParent)=>{ .... }); */
						var updatedChild = fun(c, root);
						if (updatedChild) {
									/* Fun can return an updated child. */
									return updatedChild;
						} else {
									/* If fun doesn't return anything - I just return the unmodified child. */
									return c;
						}
			});
}

function immutableCopy(root) {
			/* Copy root object */
			/* Unfortunately, just doing that isn't enough, becasue all of it's children
      will still refer to the old objects, that's how js works for some reason. */
			var newRoot = _extends({}, root);
			/* So I have to go through each child and copy it individually */
			function copyEachChild(root) {
						/* The map will return an array, containing copies of all children */
						return root.children.map(function (c) {
									/* Copy children's children */
									c.children = copyEachChild(c);
									/* Return copy of the child */
									return _extends({}, c);
						});
			}
			var copiedChildren = copyEachChild(root);
			newRoot.children = copiedChildren;
			return newRoot;
}

/* ==== GET CARDS ==== */

/* Get card by id */
function getCard(cardId, root) {
			/* console.log("Searchching for a card " + cardId + " in " + JSON.stringify(root, null, 4));*/
			/* Find card by id */
			var card = null;
			forEachChild(root, function (c) {
						/* console.log("Looping through card " + c.id);*/
						if (c.id == cardId) {
									/* console.log("Found card " + JSON.stringify(c, null, 4));*/
									card = c;
						}
						return c;
			});
			return card;
}

/* Get card's parent */
function getParent(card, root) {
			var cardsParent = root;

			forEachChild(root, function (c, p) {
						if (c.id == card.id) {
									cardsParent = p;
						}
			});

			return cardsParent;
}

function getAllParents(card, root) {
			var allParents = [];
			function getParents(card, root) {
						var parent = getParent(card, root);

						if (parent && parent.id !== "root") {
									/* If a parent exists - add it to the list of parents */
									allParents.push(parent);
									/* and get it's parents */
									getParents(parent, root);
						}
			}
			getParents(card, root);
			/* console.log("All parents " + allParents);*/
			return allParents;
}

function getAllChildren(root) {
			var allChildren = [];
			forEachChild(root, function (c) {
						allChildren.push(c);
			});
			return allChildren;
}
/* Get card relative to selected one */
function getCardRelativeTo(card, root, direction) {
			var cardPosition = getCardsPosition(card, root);
			var parent = getParent(card, root);

			switch (direction) {
						case 'up':
									cardPosition -= 1;
									break;
						case 'down':
									cardPosition += 1;
									break;
						case 'left':
									cardPosition = getCardsPosition(parent, root);
									parent = getParent(parent, root);
									break;
						case 'right':
									parent = card;
									cardPosition = 0;
									break;
			}
			var relativeCard = getCardByPosition(cardPosition, parent);

			if (relativeCard) {
						return relativeCard;
			} else {
						return card;
			}
}

/* get card by position */
function getCardByPosition(position, parent) {
			/* Find card by id */
			var card = null;
			parent.children.map(function (c, index) {
						if (index == position) {
									card = c;
						}
			});
			return card;
}

/* Get siblings. Not used anywhere. */
function getSiblings(card, root) {
			var parent = getParent(card, root);
			var siblings = parent.children;
			return siblings;
}

/* Get card's position */
function getCardsPosition(card, root) {
			var parent = getParent(card, root);
			var children = parent.children;
			var position = null;
			/* Loop through children, find the card, find out it's position */
			children.map(function (c, index) {
						if (c.id == card.id) {
									position = index;
						}
			});
			return position;
}

/* Get card's column */
/* So I could scroll it to this card, without touching anything else. */
function getCardsColumn(card, columns) {
			/* Loop through the columns */
			var cardsColumn = null;
			columns.map(function (column, columnIndex) {
						column.cardGroups.map(function (cardGroup) {
									cardGroup.cards.map(function (c) {
												/* Searching for the first child */
												if (c.id == card.id) {
															cardsColumn = columnIndex;
												}
									});
						});
			});
			/* console.log("Card's column " + cardsColumn);*/
			return cardsColumn;
}

/* Loop through columns and return the first card's children (to scroll to them) */
function getFirstChildren(card, columns) {
			var firstChildren = [];
			var cardsChildren = getAllChildren(card);
			/* Loop through the columns */
			columns.forEach(function (column, columnIndex) {
						var children = [];
						column.cardGroups.forEach(function (cardGroup) {
									/* Searching through all the cards in the column */
									cardGroup.cards.forEach(function (c) {
												/* Looking for a match with one of the children */
												cardsChildren.forEach(function (child) {
															if (c.id == child.id) {
																		/* If I've found a card's child in this column -
                     add it to the list of children */
																		children.push(c);
															}
												});
									});
						});
						/* If I've any children */
						/* Add the first element in the list to the firstChildren */
						if (children.length) {
									firstChildren.push(children[0]);
						}
			});
			/* console.log("First chilrdren " + firstChildren);*/
			return firstChildren;
}

function isActive(card, root, activeCard) {
			/* Checking card's parents and children
      if any of them is active - the card is active*/
			var isActive = false;
			var childrenActive = false;
			var parentsActive = false;
			if (card.id == activeCard) {
						isActive = true;
						return "card";
			}
			var parents = getAllParents(card, root);
			parents.map(function (r) {
						if (r.id == activeCard) {
									parentsActive = true;
									return "card";
						}
			});

			var children = getAllChildren(card, root);
			var relatives = parents.concat(children);
			children.map(function (r) {
						if (r.id == activeCard) {
									childrenActive = true;
						}
			});
			if (childrenActive) {
						return "children";
			}
			return false;
}

/* ==== EDIT CARDS ==== */

/* Insert card based on parent and position */
function insertCard(card, parent, insertPosition) {
			/* Get it's children - card's new siblings */
			var children = parent.children;
			/* Split children list into two parts, before and after insertion point */
			var cardsBefore = children.splice(0, insertPosition);
			var cardsAfter = children;
			/* Insert the card  */
			cardsBefore.push(card);
			/* Put the list of children back together */
			children = cardsBefore.concat(cardsAfter);
			/* Update the list of children */
			parent.children = children;
			return parent;
}

/* Create card, insert it into the position relative to it's creator */
function createCard(tree, relativeTo, position, card) {
			var root = tree.cards;
			/* Hacky way to generate new card's unique id */
			var id = getAllChildren(root).length + 1 + "-" + _cuid2.default.slug();
			if (!card) {
						/* If I'm not passing it a card - create an empty card */
						var testContent = "New card " + id;
						var card = {
									id: id,
									content: "",
									children: []
						};
			}

			/* Get parent of the card I'm inserting relative to */
			var parent = getParent(relativeTo, root);
			/* Get it's children - card's new siblings */
			var children = parent.children;

			var insertPosition = getCardsPosition(relativeTo, root) + 1;

			/* By default, inserting after relativeTo card. */
			switch (position) {
						case 'before':
									insertPosition -= 1;
									break;
						case 'beginning':
									insertPosition = 0;
									break;
						case 'end':
									insertPosition = children.length;
									break;
						case 'right':
									parent = relativeTo;
									children = relativeTo.children;
									insertPosition = children.length;
									break;
			}

			parent = insertCard(card, parent, insertPosition);
			root = updateCard(parent, root);
			/* console.log(JSON.stringify(root, null, 4));*/
			tree.cards = root;
			tree.activeCard = id;

			return tree;
}

function selectCard(activeCard, tree, direction) {
			var parent = getParent(activeCard, tree.cards);
			if (!(parent.id == "root" && direction == "left")) {
						var selectedCard = getCardRelativeTo(activeCard, tree.cards, direction);
						var activeCard = selectedCard;
			}
			return _extends({}, tree, { activeCard: activeCard.id });
}

/* Move card relative to itself - up/down/left/right */
function moveCard(card, root, position) {
			var cardsPosition = getCardsPosition(card, root);
			var parent = getParent(card, root);

			/* By default, inserting after relativeTo card. */
			switch (position) {
						case 'up':
									position = cardsPosition - 1;
									break;
						case 'down':
									position = cardsPosition + 1;
									break;
						case 'left':
									/* If I'm moving the card to the left - I need it's parent's parent. */
									position = getCardsPosition(parent, root) + 1;
									parent = getParent(parent, root);
									break;
						case 'right':
									/* If I'm moving te card to the right - it's parent is the card above */
									if (cardsPosition == 0) {
												console.log("You can not move the top card to the right, because moving card to the right parents it to the card above it.");
												return root;
									}
									parent = getCardByPosition(cardsPosition - 1, parent);
									break;
			}

			deleteCard(card, root);
			insertCard(card, parent, position);

			return root;
}

function dropCard(card, root, position, relativeTo) {
			var cardsPosition = getCardsPosition(card, root);
			var parent = getParent(card, root);
			var relativeToPosition = getCardsPosition(relativeTo, root);
			var relativeToParent = getParent(relativeTo, root);

			/* By default, inserting after relativeTo card. */
			switch (position) {
						case 'up':
									position = cardsPosition - 1;
									break;
						case 'down':
									position = cardsPosition + 1;
									break;
						case 'left':
									/* If I'm moving the card to the left - I need it's parent's parent. */
									position = getCardsPosition(parent, root) + 1;
									parent = getParent(parent, root);
									break;
						case 'right':
									/* If I'm moving te card to the right - it's parent is the card above */
									if (cardsPosition == 0) {
												console.log("You can not move the top card to the right, because moving card to the right parents it to the card above it.");
												return root;
									}
									parent = getCardByPosition(cardsPosition - 1, parent);
									break;
			}

			deleteCard(card, root);
			insertCard(card, parent, position);

			return root;
}

/* Find the card by id and update it's data */
/* Not used anywhere. Not sure why. */
function updateCard(card, root) {
			root.children = forEachChild(root, function (c) {
						if (c.id == card.id) {
									// Find the card.
									/* Replace it with the updated version. */
									return c = card;
						}
			});
			return root;
}

/* Delete card */
function deleteCard(card, root) {
			var parent = getParent(card, root);
			parent.children = parent.children.filter(function (child) {
						/* Return all the cards except this one */
						return child.id !== card.id;
			});
			return root;
}

/* ==== RENDER CARDS ==== */

/* Sort a json array by key */
/* Used to sort cards in order of position */
function sortByKey(array, key) {
			return array.sort(function (a, b) {
						var x = a[key];var y = b[key];
						return x < y ? -1 : x > y ? 1 : 0;
			});
}

/* Take the cards tree structure, and turn it into
   columns-groups-cards structure for rendering */
function cardsToColumns(cards) {
			var columns = [];
			/* console.log("Converting cards to columns");*/
			/* Using a nested function as a hack to keep columns in a variable */
			function convertCardsToColumns(parent, columnIndex) {
						/* Get all the children of the parent */
						var cards = parent.children;
						/* Loop over the cards and add them to the card group */
						var cardGroup = { parent: parent, cards: [] };
						cardGroup.cards = cards.map(function (card) {
									if (card.children.length) {
												convertCardsToColumns(card, columnIndex + 1);
									}
									/* Add card to the card group */
									return card;
						});

						/* Create a column if it doesn't exist */
						if (!columns[columnIndex]) {
									/* console.log(`Column ${columnIndex} doesn't exist yet, create it.`);*/
									columns[columnIndex] = {
												index: columnIndex,
												cardGroups: []
									};
						}
						/* Add card group to the column. */
						columns[columnIndex].cardGroups.push(cardGroup);
			}

			convertCardsToColumns(cards, 0);
			/* console.log("Converted cards to columns");*/
			/* console.log(columns);    */
			return columns;
}

function search(card, query) {
			if (!query) {
						return true;
			}

			var content = card.content;
			/* content = removeMd(content);*/
			content = content.toLowerCase();
			query = query.toLowerCase();
			var words = query.split(" ");
			console.log(words);
			var found = true;
			words.map(function (w) {
						if (w && !content.includes(w.trim())) {
									console.log("found " + w);
									found = false;
						}
			});

			return found;
}

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.signin = signin;
exports.signup = signup;
exports.getUser = getUser;
exports.payment = payment;
var jwt = __webpack_require__(24);
var config = __webpack_require__(5);
var User = __webpack_require__(6);

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
	console.log("Email/Pass is correct, returning token.");
	res.send({ token: tokenForUser(req.user), email: req.body.email });
}

function signup(req, res, next) {
	var email = req.body.email;
	var password = req.body.password;
	var referral = req.body.referral;
	var source = req.body.source;

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
			console.log("Email is in use. " + email);
			return res.status(422).send({
				error: 'Email is in use'
			});
		}

		// If a user doesn't exist - create and save user record
		var user = new User({
			email: email,
			password: password,
			referral: referral,
			source: source
		});
		if (referral) {
			/* If user was referred, give him 100 free cards.  */
			user.cardLimit = 300;
			/* Find a user who invited this guy, give him cards, increase invited */
			User.findOne({ referralCode: referral }, function (err, referrer) {
				if (err) {
					return next(err);
				}
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
		user.save(function (err, user) {
			//This is a callback that's being caleld once user is saved
			if (err) {
				return next(err);
			}
			console.log("User successfully created! " + email);
			/* Return the user I've just created */
			res.send({
				token: tokenForUser(user),
				email: user.email,
				plan: user.plan,
				referralCode: user.referralCode,
				cardLimit: user.cardLimit
			});
		});
	});
}

function getUser(req, res) {
	var email = req.user.email;
	console.log("Get user. " + email);
	// Search for a user with a given email
	User.findOne({ email: email }, function (err, user) {
		if (err) {
			return next(err);
		}
		res.send({
			email: user.email,
			plan: user.plan,
			referralCode: user.referralCode,
			cardLimit: user.cardLimit
		});
	});
}

function payment(req, res) {
	console.log("Payment!");

	// Set your secret key: remember to change this to your live secret key in production
	// See your keys here: https://dashboard.stripe.com/account/apikeys
	var stripe = __webpack_require__(27)(config.stripeSecret);

	// Token is created using Stripe.js or Checkout!
	// Get the payment token submitted by the form:
	var token = req.body.id;
	console.log(JSON.stringify(req.body));
	if (token == "Monthly" || token == "Yearly" || token == "Lifetime Unlimited") {
		/* Surprise free account. Setting account according to the upgrade he chose. */
		User.findOne({ email: req.user.email }, function (err, user) {
			if (err) {
				return next(err);
			}
			/* Set user's plan to unlimited */
			user.plan = token;
			user.save(function (err, user) {
				if (err) {
					return next(err);
				}
				console.log("User's plan is set to unlimited.");
				/* Return updated user */
				res.send({
					message: "User's plan is set to unlimited.",
					user: user
				});
			});
		});
	} else {
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
}

/***/ }),
/* 20 */
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
						type: Date,
						default: null
			},
			updatedAt: {
						type: Date,
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

treeSchema.pre('save', function (next) {
			var now = new Date();
			this.updatedAt = now;
			if (!this.createdAt) {
						this.createdAt = now;
			}
			next();
});
// Create model class
var TreeModel = mongoose.model('tree', treeSchema);

// Export model
module.exports = TreeModel;

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(__dirname) {

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = __webpack_require__(0);

var _express2 = _interopRequireDefault(_express);

var _http = __webpack_require__(14);

var _http2 = _interopRequireDefault(_http);

var _bodyParser = __webpack_require__(12);

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _morgan = __webpack_require__(15);

var _morgan2 = _interopRequireDefault(_morgan);

var _mongoose = __webpack_require__(1);

var _mongoose2 = _interopRequireDefault(_mongoose);

var _cors = __webpack_require__(13);

var _cors2 = _interopRequireDefault(_cors);

var _path = __webpack_require__(16);

var _path2 = _interopRequireDefault(_path);

var _util = __webpack_require__(17);

var _util2 = _interopRequireDefault(_util);

var _profilesRoutes = __webpack_require__(10);

var _profilesRoutes2 = _interopRequireDefault(_profilesRoutes);

var _treesRoutes = __webpack_require__(11);

var _treesRoutes2 = _interopRequireDefault(_treesRoutes);

var _tree = __webpack_require__(4);

var treeControllers = _interopRequireWildcard(_tree);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Connect to db.
// manipulate filepaths
// ORM between mongo and node.
// Parse requests, turn them into json
_mongoose2.default.Promise = global.Promise;

/* Controllers */


/* Routes */
// Cors allows requests from different domains
// A logging framework, terminal output for debugging.

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

/* Export */
server.get('/tree/:slug.md', treeControllers.exportTree);

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
/* 22 */
/***/ (function(module, exports) {

module.exports = require("bcrypt-nodejs");

/***/ }),
/* 23 */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),
/* 24 */
/***/ (function(module, exports) {

module.exports = require("jwt-simple");

/***/ }),
/* 25 */
/***/ (function(module, exports) {

module.exports = require("passport-local");

/***/ }),
/* 26 */
/***/ (function(module, exports) {

module.exports = require("slug");

/***/ }),
/* 27 */
/***/ (function(module, exports) {

module.exports = require("stripe");

/***/ }),
/* 28 */
/***/ (function(module, exports) {

module.exports = require("validator");

/***/ })
/******/ ])));