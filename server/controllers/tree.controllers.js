import fs from 'fs';
import removeMd from 'remove-markdown';
import cuid from 'cuid';
import slug from 'slug';

const Tree = require('../models/tree');

export function getTree (req, res, next) {
    var slug = req.params.slug;
    console.log("Get tree " + slug);
    /* Find a tree by id, and send it as a respponse */
    Tree.findOne({slug:slug}, function(err, tree){
	if (err) { return next(err); }
	/* console.log("tree " + tree);*/
	return res.send(tree);
    });
}

/* Delete a tree  */
export function deleteTree(req, res) {
    if (!req.params) { res.status(500).end(); }

    var slug = req.params.slug;
    console.log("Deleting tree.");
    Tree.findOne({ slug: slug }).exec((err, tree) => {
	if (err) { res.status(500).send(err); }
	console.log("Deleted tree " + tree.slug);
	tree.remove(() => {
	    res.status(200).end();
	});
    });
}

export function listTrees (req, res, next) {
    console.log('List trees ' + req.user.email);
    /* Return the list of all trees */
    Tree.find({author:req.user.email}).then((allTrees)=>{
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

export function createTree (req, res, next) {
    /* Getting the tree from the POST request sent to me by react */
    var tree = req.body;
    console.log("Creating tree. Received from react: " + JSON.stringify(tree));
    if (!tree.name) {
	/* If I haven't set a name - set it to the first line */
	var firstCard = tree.cards.children[0];
	var firstLine = firstCard.content.split('\n')[0];
	tree.name = removeMd(firstLine);
	if (!tree.name) {
	    tree.name = "Empty";
	}
    }
    /* Create slug - just slugify name */
    tree.slug = slug(tree.name)+"-"+cuid.slug();
    /* Set tree's author to email passed to me by the passport */
    tree.author = req.user.email;
    tree = new Tree(tree);

    console.log("Creating new tree: " + tree.name);
    tree.save((err,tree)=>{
	if (err) { return next(err); }
	console.log("New tree created.");
	return res.send(tree);
    });
}


export function updateTree (req, res, next) {
    /* Getting the tree from the POST request sent to me by react */
    var tree = req.body;
    /* Just in case, set tree's author to email passed to me by the passport */
    tree.author = req.user.email;
    var options =  { upsert: true, new: true, setDefaultsOnInsert: true };
    /* Find a tree by id and create it if it doesn't exist */
    Tree.findOne({slug:tree.slug}, (err, t) => {
	if (err) { return next(err); }
	/* If tree does exist - update it. */
	console.log("Updating tree. Received from react: " + JSON.stringify(tree));
	Tree.findOneAndUpdate({slug:tree.slug}, tree, (err, t) => {
	    if (err) { return next(err); }
	    /* console.log("Updated tree! " + JSON.stringify(t));*/
	    return res.send(tree);
	});
    });
}


