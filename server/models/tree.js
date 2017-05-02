/* Mongoose is ORM, like models.py in django */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define model. 
const treeSchema = new Schema({
    slug: {
	type: String,
	unique: true,
	required: true,	
	lowercase: true,
	index: true,
    },
    author: {
	type: String,
	required: true,	
	lowercase: true,
	index: true,
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
const TreeModel = mongoose.model('tree', treeSchema);

// Export model
module.exports = TreeModel;

