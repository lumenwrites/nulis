import Tree from './models/tree';

var fs = require('fs');

var AboutTemplate = JSON.parse(fs.readFileSync('../assets/trees/about.nls', 'utf8'));
var BlankTemplate = JSON.parse(fs.readFileSync('../assets/trees/blank.nls', 'utf8'));
var StoryStructureTemplate = JSON.parse(fs.readFileSync('../assets/trees/storystructure.nls', 'utf8'));

export default function initialData () {
    Tree.count().exec((err, count) => {
	if (count > 0) {
	    return;
	}

	const aboutTree = new Tree(AboutTemplate);
	const blankTree = new Tree(BlankTemplate);
	const storyStructureTree = new Tree(StoryStructureTemplate);

	Tree.create([aboutTree, blankTree, storyStructureTree], (error) => {
	    if (!error) {
		console.log('Initial data loaded.');
	    }
	});
    });
}

