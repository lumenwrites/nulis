/* import { FETCH_POSTS, FETCH_POST } from '../actions/index';*/
import { getCard, createCard, updateCard, deleteCard, moveCard,
	 getAllChildren, getCardRelativeTo, selectCard, immutableCopy } from '../utils/cards';
import { DEFAULT_TREE } from '../data';
/* List of all posts and an active post  */
var INITIAL_STATE = DEFAULT_TREE;

export default function(state=INITIAL_STATE, action) {
    var tree = JSON.parse(JSON.stringify(state));
    var root = JSON.parse(JSON.stringify(state.cards));
    var card = action.payload;
    var activeCard = getCard(tree.activeCard, tree.cards);
    tree.debugging = JSON.stringify(action.payload);
    
    switch(action.type) {
	case 'CREATE_CARD':
	    /* Creating a card relative to itself */
	    var relativeTo = getCard(state.activeCard, root);

	    if (action.payload.card) {
		/* If I have passed a card from clicking a button - I insert
		 relative to that. */
		relativeTo = action.payload.card;
	    }
		
	    var direction =  action.payload.direction;
	    tree = createCard(tree, relativeTo, direction);
	    tree.editing = true;
	    tree.modified = true;    
	    tree.saved = false;
	    /* tree.debugging = "Created card " + direction + " " + creator.id;*/
	    return tree;
	case 'DROP_CARD':
	    var droppedCard = action.payload.card
	    var relativeTo = getCard(action.payload.relativeTo, root);
	    var direction =  action.payload.direction;

	    /* Delete card */
	    var updatedRoot = deleteCard(droppedCard, root);
	    tree.cards = updatedRoot;

	    /* Create card relative to the card I've dropped it after */
	    tree = createCard(tree, relativeTo, direction, droppedCard);
	    tree.activeCard = droppedCard.id;
	    tree.modified = false;
	    tree.saved = false;
	    return tree;
	    
	case 'UPDATE_CARD':
	    root = updateCard(card, root);
	    tree.cards = root;
	    tree.modified = true;	    
	    tree.saved = false;
	    /* tree.debugging = "Updated card <br/>" + card.id + " <br/>" + card.content;*/
	    /* console.log("Update card " + JSON.stringify(root));*/
	    return tree;
	case 'MOVE_CARD':
	    var direction = action.payload;
	    root = moveCard(activeCard, root, direction);
	    tree.cards = root;
	    /* Even though it's a lie,
	       it gets the Main component to rescroll after moving. */
	    tree.modified = false;
	    tree.scroll = true;
	    tree.activeCard = activeCard.id;
	    tree.saved = false;
	    /* tree.debugging = "Move card " + direction + " " + activeCard.id;*/
	    return tree;
	case 'SELECT_CARD':
	    var direction = action.payload;
	    tree = selectCard(activeCard, tree, direction);
	    tree.saved = false;
	    return tree;
	case 'DELETE_CARD':
	    /* var rootCopy = immutableCopy(root);*/
	    /* Which card to select after deleting this one */
	    /* Select the card above this one by default */
	    var newActiveCard = getCardRelativeTo(activeCard, root, "up");
	    if (newActiveCard == activeCard) {
		/* If the card is already at the top of the column,
		   select the one below  */
		newActiveCard = getCardRelativeTo(activeCard, root, "down");
		if (newActiveCard == activeCard) {
		    /* If there's no card below it -
		       then it's the last card in the column,
		       so select it's parent*/
		    newActiveCard = getCardRelativeTo(activeCard, root, "left");
		}
	    }
	    var updatedRoot = deleteCard(activeCard, root);
	    tree.cards = updatedRoot;
	    tree.activeCard = newActiveCard.id;
	    tree.modified = false;
	    tree.saved = false;

	    return tree;
	case 'SET_ACTIVE_CARD':
	    /* console.log("Set active card");*/
	    return {...state, activeCard: action.payload };
	case 'SET_CARD_COLOR':
	    var color = action.payload;
	    activeCard.color = color;

	    root = updateCard(activeCard, root);
	    /* console.log("Set active card");*/
	    return {...state, cards: root };
	case 'CHECKBOX':
	    var {index, cardId} = action.payload;
	    var card = getCard(cardId, root);
	    var content = card.content;

	    var checkboxRegexp = new RegExp(/\[(X| )\]/, 'ig');
	    var i = 0;
	    content = content.replace(checkboxRegexp, (match)=>{
		i++;
		if (index == i) {
		    console.log("check");
		    if (match == "[X]") {
			return "[ ]";			
		    } else {
			return "[X]";						
		    }

		} 
		return match;
	    });
	    console.log("Checkbox" + content);
	    card.content = content;
	    
	    root = updateCard(card, root);

	    return {...state, cards: root };
	    
	case 'SET_CARD_CONFIG':
	    return {...state, showCardConfig:action.payload };

	case 'SET_SCROLL':
	    return {...state, scroll: action.payload };	    
	case 'SET_EDITING':
	    return {...state, modified:false, editing: action.payload };
	case 'UPDATE_TREE_NAME':
	    return {...state, name: action.payload, saved:false };	    
	case 'AUTOSAVE_TREE':
	    return {...state, modified: false };
	case 'UPDATE_TREE':
	    var tree = action.payload;
	    /* Tell it that tree is saved */
	    return {...state, modified: false, editing:false, saved:true };
	case 'LOAD_TREE':
	    var tree = action.payload;
	    /* console.log("Loading tree reducer");*/
	    /* console.log(JSON.stringify(action.payload, null, 4));	    */
	    /* Replace state with loaded tree */
	    /* return tree;*/
	    return { ...tree, modified: false };	    

	case 'UPDATE_SEARCH_QUERY':
	    return { ...tree, query: action.payload };	    	    
	default:
	    return state;
    }
}
