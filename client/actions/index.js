import axios from 'axios';
import { browserHistory } from 'react-router';

import { DEFAULT_TREE } from '../data';

import { getCard } from '../utils/cards';
import { handleScroll } from '../utils/handleScroll';

var API_URL = 'https://nulis.io/api/v1';
if (process.env.NODE_ENV === 'development') {
    API_URL = 'http://localhost:3000/api/v1';
}
console.log("API_URL " + API_URL);
export {API_URL};


export function updateSearchQuery(value) {
    /* unused */
    return {
	type: 'UPDATE_SEARCH_QUERY',
	payload: value
    }
}


export function updateTreeName(value) {
    /* unused */
    return {
	type: 'UPDATE_TREE_NAME',
	payload: value
    }
}

export function createCard(direction, card) {
    return {
	type: 'CREATE_CARD',
	payload: {direction,card}
    }
}

export function dropCard(direction, relativeTo, card) {
    return {
	type: 'DROP_CARD',
	payload: {direction, relativeTo, card}
    }
}

export function updateCard(card, content) {
    card.content = content;
    /* console.log("Card updated " + JSON.stringify(card));    */
    return {
	type: 'UPDATE_CARD',
	payload: card
    }
}

export function deleteCard() {
    /* console.log("Card deleted " + JSON.stringify(card));    */
    return {
	type: 'DELETE_CARD',
	payload: null
    }
}

export function selectCard(direction) {
    return {
	type: 'SELECT_CARD',
	payload: direction
    }
}


export function moveCard(direction) {
    /* console.log("Moving card  " + JSON.stringify(card));    */
    return {
	type: 'MOVE_CARD',
	payload: direction
    }
}

export function setActiveCard(cardId) {
    return {
	type: 'SET_ACTIVE_CARD',
	payload: cardId
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

    const config = {
	headers:  { authorization: localStorage.getItem('token')}	
    };

    
    return function(dispatch) {
	axios.post(tree_url, tree, config)
	     .then(response => {
		 console.log("Saved tree, redirecting to it.");
		 browserHistory.push('/tree/'+response.data.slug);
		 dispatch({
		     type: 'LOAD_TREE',
		     payload: response.data
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



export function autosaveTree(tree) {
    localStorage.setItem('tree', JSON.stringify(tree));
    /* console.log("Autosaving tree");*/
    return {
	type: 'AUTOSAVE_TREE',
	payload: tree
    }
}

export function loadLocalTree() {
    var tree = localStorage.getItem('tree');
    tree = JSON.parse(tree);
    /* console.log("Loading tree from local storage " + JSON.stringify(tree));   */
    return {
	type: 'LOAD_TREE',
	payload: tree
    }
}
export function loadTree(slug) {
    var tree_url = `${API_URL}/tree/${slug}`;
    console.log("Loading tree from " + tree_url);
    return function(dispatch) {    
	axios.get(tree_url)
	     .then(response => {
		 if (response.data) {
		     /* If returned a tree - return a tree */
		     dispatch({
			 type: 'LOAD_TREE',
			 payload: response.data
		     });
		 } else {
		     console.log(tree_url + " didn't return any tree.");
		     browserHistory.push('/');
		 }
	     });
    };
}

export function setTree(tree) {
    return {
	type: 'LOAD_TREE',
	payload: tree
    }
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

export function loadTemplates() {
    var url = `${API_URL}/templates`;
    return function(dispatch) {    
	axios.get(url)
	     .then(response => {
		 /* console.log("All trees " + JSON.stringify(response.data));*/
		 dispatch({
		     type: 'LIST_TREES',
		     payload: response.data
		 });
	     })
    };
}


import aboutTemplate from '../../assets/trees/about.nls';
import blankTemplate from '../../assets/trees/blank.nls';
import storyTemplate from '../../assets/trees/story.nls';

export function loadTemplate(name) {
    const aboutTree = JSON.parse(aboutTemplate);
    const blankTree = JSON.parse(blankTemplate);
    const storyTree = JSON.parse(storyTemplate);
    
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

