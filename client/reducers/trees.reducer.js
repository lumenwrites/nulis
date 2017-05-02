/* import { FETCH_POSTS, FETCH_POST } from '../actions/index';*/
import { getCard, createCard, updateCard, deleteCard, moveCard } from '../utils/cards';
import { DEFAULT_TREE } from '../data';

var INITIAL_STATE = []

export default function(state=INITIAL_STATE, action) {
    switch(action.type) {
	case 'LIST_TREES':
	    var trees = action.payload;
	    return trees;	    
	default:
	    return state;
    }
}
