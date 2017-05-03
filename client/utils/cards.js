import cuid from 'cuid';
import removeMd from 'remove-markdown';

/* Apply a function to every child of a card.
   Return the list of updated children. */
export function forEachChild(root, fun) {
    /* console.log("root " + JSON.stringify(root, null, 4));*/
    /* Return updated children */
    return root.children.map((c)=>{
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

export function immutableCopy(root) {
    /* Copy root object */
    /* Unfortunately, just doing that isn't enough, becasue all of it's children
       will still refer to the old objects, that's how js works for some reason. */
    var newRoot = {...root};
    /* So I have to go through each child and copy it individually */
    function copyEachChild(root) {
	/* The map will return an array, containing copies of all children */
	return root.children.map((c)=>{
	    /* Copy children's children */
	    c.children = copyEachChild(c);
	    /* Return copy of the child */
	    return {...c};
	});
    }
    var copiedChildren = copyEachChild(root);
    newRoot.children = copiedChildren;
    return newRoot;
}

/* ==== GET CARDS ==== */

/* Get card by id */
export function getCard(cardId, root) {
    /* console.log("Searchching for a card " + cardId + " in " + JSON.stringify(root, null, 4));*/
    /* Find card by id */
    var card = null;
    forEachChild(root, (c)=>{
	/* console.log("Looping through card " + c.id);*/
	if (c.id == cardId) {
	    /* console.log("Found card " + JSON.stringify(c, null, 4));*/
	    card = c;
	}
	return c;
    })
    return card;
}

/* Get card's parent */
export function getParent(card, root) {
    var cardsParent = root;

    forEachChild(root, (c, p)=>{
	if (c.id == card.id) { cardsParent = p; }
    });

    return cardsParent;
}

export function getAllParents(card, root) {
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
    getParents(card,root);
    /* console.log("All parents " + allParents);*/
    return allParents;
}

export function getAllChildren(root) {
    var allChildren = [];
    forEachChild(root, (c)=>{
	allChildren.push(c);
    });
    return allChildren;
}
/* Get card relative to selected one */
export function getCardRelativeTo(card, root, direction) {
    var cardPosition = getCardsPosition(card, root);
    var parent = getParent(card, root);
    
    switch(direction) {
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
export function getCardByPosition(position, parent) {
    /* Find card by id */
    var card = null;
    parent.children.map((c, index)=>{
	if (index == position) {
	    card = c;
	}
    });
    return card;
}

/* Get siblings. Not used anywhere. */
export function getSiblings(card, root) {
    var parent = getParent(card, root);
    var siblings = parent.children;
    return siblings;
}


/* Get card's position */
export function getCardsPosition(card, root) {
    var parent = getParent(card, root);
    var children = parent.children;
    var position = null;
    /* Loop through children, find the card, find out it's position */
    children.map((c, index)=>{
	if (c.id == card.id) {
	    position = index;
	}
    });
    return position;
}

/* Get card's column */
/* So I could scroll it to this card, without touching anything else. */
export function getCardsColumn(card, columns) {
    /* Loop through the columns */
    var cardsColumn = null;
    columns.map((column, columnIndex)=>{
	column.map((cardGroup)=>{
	    cardGroup.cards.map((c)=>{
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
export function getFirstChildren(card, columns) {
    var firstChildren = [];
    var cardsChildren = getAllChildren(card);
    /* Loop through the columns */
    columns.forEach((column, columnIndex)=>{
	var children = []
	column.forEach((cardGroup)=>{
	    /* Searching through all the cards in the column */
	    cardGroup.cards.forEach((c)=>{
		/* Looking for a match with one of the children */
		cardsChildren.forEach((child)=>{
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



export function isActive(card, root, activeCard) {
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
    parents.map((r)=>{
	if (r.id == activeCard) {
	    parentsActive = true;
	    return "card";
	}
    });
    
    var children = getAllChildren(card, root);	    
    var relatives = parents.concat(children);
    children.map((r)=>{
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
export function insertCard(card, parent, insertPosition) {
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
export function createCard(tree, relativeTo, position, card) {
    var root = tree.cards;	    
    /* Hacky way to generate new card's unique id */
    var id = getAllChildren(root).length + 1 +"-"+cuid.slug();
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
    switch(position) {
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

export function selectCard(activeCard, tree, direction) {
    var parent = getParent(activeCard, tree.cards);
    if (!(parent.id == "root" && direction == "left")) {
	var selectedCard = getCardRelativeTo(activeCard, tree.cards, direction);
	var activeCard = selectedCard;
    } 
    return {...tree, activeCard: activeCard.id}
}

/* Move card relative to itself - up/down/left/right */
export function moveCard(card, root, position) {
    var cardsPosition = getCardsPosition(card, root);
    var parent = getParent(card, root);

    /* By default, inserting after relativeTo card. */
    switch(position) {
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

export function dropCard(card, root, position, relativeTo) {
    var cardsPosition = getCardsPosition(card, root);
    var parent = getParent(card, root);
    var relativeToPosition = getCardsPosition(relativeTo, root);
    var relativeToParent = getParent(relativeTo, root);

    /* By default, inserting after relativeTo card. */
    switch(position) {
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
export function updateCard(card, root) {
    root.children = forEachChild(root, (c)=>{
	if (c.id == card.id) { 	// Find the card.
	    /* Replace it with the updated version. */
	    return c = card;
	}
    })
    return root;
}

/* Delete card */
export function deleteCard(card, root) {
    var parent = getParent(card, root);
    parent.children = parent.children.filter((child)=>{
	/* Return all the cards except this one */
	return child.id !== card.id;
    });
    return root;
}



/* ==== RENDER CARDS ==== */

/* Sort a json array by key */
/* Used to sort cards in order of position */
export function sortByKey(array, key) {
    return array.sort(function(a, b) {
	var x = a[key]; var y = b[key];
	return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}	

/* Take the cards tree structure, and turn it into
   columns-groups-cards structure for rendering */
export function cardsToColumns (cards) {
    var columns = [];
    
    /* Using a nested function as a hack to keep columns in a variable */
    function convertCardsToColumns (parent, column) {
	/* Get all the children of the parent */
	var cards = parent.children;
	/* Loop over the cards and add them to the card group */
	var cardGroup = {parent: parent, cards:[]};
	cards.map((card) => {
	    /* Add card to the card group */
	    cardGroup.cards.push(card);
	    if (card.children.length) {
		convertCardsToColumns(card, column + 1);
	    }
	});
	/* If column exists - add this card group to it, otherwise create it. */
	if (columns[column]) {
	    columns[column].push(cardGroup);
	} else {
	    columns[column]=[cardGroup];
	}
    }

    convertCardsToColumns(cards, 1);

    return columns;
}


export function search(card, query) {
    if (!query) { return true; }

    var content = card.content;
    /* content = removeMd(content);*/
    content = content.toLowerCase();
    query = query.toLowerCase();    

    return content.includes(query);
}

