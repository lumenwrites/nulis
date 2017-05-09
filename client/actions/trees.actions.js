import axios from 'axios';
import saveAs from 'save-as'

import { browserHistory } from 'react-router';

import { DEFAULT_TREE } from '../data';

import { getCard } from '../utils/cards';
import { handleScroll } from '../utils/handleScroll';

import {API_URL} from './cards.actions';

const config = {
    headers:  { authorization: localStorage.getItem('token')}	
};

export function updateTreeName(value) {
    /* unused */
    return {
	type: 'UPDATE_TREE_NAME',
	payload: value
    }
}

export function setScroll(scroll) {
    return {
	type: 'SET_SCROLL',
	payload: scroll
    }
}

export function setEditing(boolean) {
    return {
	type: 'SET_EDITING',
	payload: boolean
    }
}

export function createTree(tree) {
    var tree_url = `${API_URL}/trees`;
    
    delete tree._id;
    console.log("Creating a tree " + tree.name);    
    return function(dispatch) {
	axios.post(tree_url, tree, config)
	     .then(response => {
		 console.log("Created a tree, redirecting to it.");
		 browserHistory.push('/tree/'+response.data.slug);
		 var tree = response.data;
		 tree.saved = true;
		 tree.source = "Online";	
		 dispatch({
		     type: 'LOAD_TREE',
		     payload: tree
		 });
	     });
    }
}

export function updateTree(tree) {
    var tree_url = `${API_URL}/tree/${tree.slug}`;
    console.log("Updating a tree " + tree.name);

    delete tree._id;
    return function(dispatch) {
	axios.post(tree_url, tree, config)
	     .then(response => {
		 console.log("Updated a tree, redirecting to it.");
		 browserHistory.push('/tree/'+response.data.slug);
		 var tree = response.data;
		 tree.saved = true;
		 tree.source = "Online";	
		 dispatch({
		     type: 'LOAD_TREE',
		     payload: tree
		 });
	     });
    }
}

export function saveTree(tree) {
    var tree_url = null;
    if (tree.slug) {
	/* If tree has a slug - updating it */
	tree_url = `${API_URL}/tree/${tree.slug}`;
	console.log("Saving(updating) a tree " + tree.name);
    } else {
	/* If there's no slug - create a new tree */
	tree_url = `${API_URL}/trees`;
	console.log("Saving(creating) a tree " + tree.name);    
    }

    return function(dispatch) {
	axios.post(tree_url, tree, config)
	     .then(response => {
		 console.log("Saved tree, redirecting to it.");
		 browserHistory.push('/tree/'+response.data.slug);
		 var tree = response.data;
		 tree.saved = true;
		 tree.source = "Online";	

		 dispatch({
		     type: 'LOAD_TREE',
		     payload: tree
		 });
	     });
    }
}

export function deleteTree(tree) {
    var tree_url = `${API_URL}/tree/${tree.slug}`;

    const config = {
	headers:  { authorization: localStorage.getItem('token')}	
    };
    
    console.log("Deleting tree " + tree.slug);    
    return function(dispatch) {
	axios.delete(tree_url, config)
	     .then(response => {
		 console.log("Deleted tree");
		 browserHistory.push('/trees');
		 dispatch({
		     type: 'DELETE_TREE',
		     payload: tree
		 });
	     });
    }
}


export function saveTreeBrowser(tree) {
    localStorage.setItem('tree', JSON.stringify(tree));
    /* console.log("Autosaving tree");*/
    return {
	type: 'AUTOSAVE_TREE',
	payload: tree
    }
}

export function loadTreeBrowser() {
    var tree = localStorage.getItem('tree');
    tree = JSON.parse(tree);
    tree.source = "Browser";	
    /* console.log("Loading tree from local storage " + JSON.stringify(tree));   */
    return {
	type: 'LOAD_TREE',
	payload: tree
    }
}


/* Opening and saving files */
export function loadTreeFile(e, results){
    /* Get file contents from the magical component */
    var [e, file] = results[0];
    const contents = e.target.result;
    console.log(JSON.stringify(file.name));
    /* Parse file, turn it into json tree */
    const tree = JSON.parse(contents);
    if (!tree.name) {
	tree.name = file.name.slice(0, -4);
    }
    tree.source = "File";
    delete tree._id;
    /* console.log(`Successfully loaded ${JSON.stringify(tree)}!`);*/
    /* Replace my state with it */
    browserHistory.push('/file/'+tree.name);

    return {
	type: 'LOAD_TREE',
	payload: tree
    }
}   

export function saveTreeFile(tree) {
    /* Take my tree from state and stringify it */
    tree.modified = false;
    if (!tree.name) {
	/* Generate tree name if there isn't any */
	var firstCard = tree.cards.children[0];
	var firstLine = firstCard.content.split('\n')[0];
	tree.name = removeMd(firstLine).substring(0,40);
    }
    tree.slug = "";
    delete tree._id;

    var contents = JSON.stringify(tree, null, 4);
    /* Use magical component to save it into a file */
    var blob = new Blob([contents],
			{ type: 'application/json;charset=utf-8' });
    var filename = tree.name+'.nls';
    saveAs(blob, filename);

    return {
	type: 'SAVED_TO_FILE'
    };
}



export function loadTree(slug) {
    var tree_url = `${API_URL}/tree/${slug}`;
    console.log("Loading tree from " + tree_url);
    return function(dispatch) {    
	axios.get(tree_url)
	     .then(response => {
		 if (response.data) {
		     var tree = response.data;
		     tree.saved = true;
		     tree.source = "Online";	
		     /* If returned a tree - return a tree */
		     dispatch({
			 type: 'LOAD_TREE',
			 payload: tree
		     });
		 } else {
		     console.log(tree_url + " didn't return any tree.");
		     browserHistory.push('/');
		 }
	     });
    };
}


export function listTrees() {
    var url = `${API_URL}/trees`;

    const config = {
	headers:  { authorization: localStorage.getItem('token')}	
    };
    
    return function(dispatch) {    
	axios.get(url, config)
	     .then(response => {
		 dispatch({
		     type: 'LIST_TREES',
		     payload: response.data
		 });
	     }).catch(err => {
		 // If there was a problem, we want to
		 // dispatch the error condition
		 dispatch({
		     type: 'LIST_TREES',
		     payload: null
		 });
		 console.log(err);
		 return err;
	     });
    };
}


import aboutTemplate from '../../assets/trees/about.nls';
import blankTemplate from '../../assets/trees/blank.nls';
import storyTemplate from '../../assets/trees/story.nls';

export function loadTemplate(name) {
    const aboutTree = JSON.parse(aboutTemplate);
    const blankTree = JSON.parse(blankTemplate);
    const storyTree = JSON.parse(storyTemplate);
    aboutTree.source = "Template";
    blankTree.source = "Template";
    storyTree.source = "Template";	

    console.log("Loading tree from template " + name);
    switch(name) {
	case 'About':
	    return {
		type: 'LOAD_TREE',
		payload: aboutTree
	    }
	case 'Blank':
	    /* console.log("Blank Template: ");*/
	    /* console.log(JSON.stringify(blankTree, null, 4));	    */
	    return {
		type: 'LOAD_TREE',
		payload: blankTree
	    }
	case 'Story':
	    return {
		type: 'LOAD_TREE',
		payload: storyTree
	    }
	default:
	    return {
		type: 'LOAD_TREE',
		payload: BLANK_TREE
	    }
	    
    }
}


export function updateSearchQuery(value) {
    /* unused */
    return {
	type: 'UPDATE_SEARCH_QUERY',
	payload: value
    }
}

