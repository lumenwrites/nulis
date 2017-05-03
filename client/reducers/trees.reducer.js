/* import { FETCH_POSTS, FETCH_POST } from '../actions/index';*/
import { getCard, createCard, updateCard, deleteCard, moveCard } from '../utils/cards';
import { DEFAULT_TREE } from '../data';

var INITIAL_STATE = []

export default function(state=INITIAL_STATE, action) {
    switch(action.type) {
	case 'LIST_TREES':
	    var trees = action.payload;

	    return trees;	    
	case 'DELETE_TREE':
	    var deletedTree = action.payload;
	    var trees = state;
	    console.log(JSON.stringify(trees));
	    trees = trees.filter((t)=>{
		return t.slug != deletedTree.slug;
	    });
	    return [...trees];	    

	default:
	    return state;
    }
}
