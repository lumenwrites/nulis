import { getCard, getParent, getAllChildren } from './cards';

/* Implements the drag source contract. */
export const cardSource = {
    beginDrag(props) {
	// Return the data describing the dragged item
	const item = { cardId: props.card.id };
	return item;
    },

    endDrag(props, monitor, component) {
	const item = monitor.getItem();
	const dropResult = monitor.getDropResult();
	if (dropResult) {
	    /* Trigger this once the card is dropped */
	    var card = null;
	    var parent = null;
	    var children = null;
	    var childrenIds = null;	    	    

	    var dropIt = true;
	    card = getCard(item.cardId,props.tree.cards);
	    parent = getParent(card, props.tree.cards);
	    children = getAllChildren(card, props.tree.cards);
	    childrenIds = children.map((c)=>c.id);
	    
	    /* If I'm not dropping the card on itself
	       or on it's own parent, or on one of it's children.  */
	    if (item.cardId != dropResult.parentId
		&& !(parent.id == dropResult.parentId && dropResult.position=="right")
		&& !childrenIds.includes(dropResult.parentId)) {
		/* Trigger action that will move the card */
		/* console.log( `Dropped ${item.cardId} into ${dropResult.parentId}!`);*/
		props.dropCard(dropResult.position, dropResult.parentId, props.card);
	    } else {
		console.log("Cancel DnD. Trying to drop onto itself/parent/children.");
	    }
	}
    }
};
