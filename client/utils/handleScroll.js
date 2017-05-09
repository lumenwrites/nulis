import {TweenMax} from "gsap";

import { cardsToColumns, getChildren, getCard, getParent, getAllParents,
	 getAllChildren, forEachCard, getFirstChildren, getCardsColumn } from './cards';


export function scrollTo(card, column) {
    var card = document.getElementById('card-' + card.id);
    /* var card = ReactDOM.findDOMNode(card);*/
    var col = document.getElementById('column-'+column)

    /* For search. If couldn't find a card - dont scroll. */
    if (!(card && col)){ return null;}

    var rect = card.getBoundingClientRect();
    var colRect = col.getBoundingClientRect();

    /* Calculate card's center. (relative to what?) */
    var cardCenter = rect.top + rect.height*0.5;

    /* If I want to scroll the top of the card to almost the top of the column.  */
    cardCenter = rect.top + colRect.height/4;
    
    var scrollTop = col.scrollTop + (cardCenter - col.offsetHeight*0.5)
    /* col.scrollTop = scrollTop;*/

    TweenMax.to(col, 0.15, { scrollTop: scrollTop, ease: Power2.easeInOut });
}


export default function handleScroll(cardId, cards, columns) {
    /* console.log(cardId);*/
    var card = getCard(cardId, cards);
    /* console.log("Scrolling to card " + JSON.stringify(cardId, null, 4));*/
    var allParents = getAllParents(card, cards);
    /* console.log("All parents " + JSON.stringify(allParents));*/

    var firstChildren = getFirstChildren(card, columns);
    /* console.log("First children " + JSON.stringify(allParents));*/

    var scrolledColumns = [];
    
    /* Scroll to all of it's parents */
    allParents.map((p)=> {
	var cardsColumn = getCardsColumn(p, columns);
	scrollTo(p, cardsColumn);
	scrolledColumns.push(cardsColumn);
    });
    /* Scroll to the active card */
    var column = getCardsColumn(card, columns);
    scrollTo(card, column);
    scrolledColumns.push(column);

    /* console.log("Scrolling to\n" + card.content.substring(0, 30));*/
    /* Scroll to all of it's first children */
    firstChildren.map((c)=> {
	var childsColumn = getCardsColumn(c, columns);
	scrollTo(c, childsColumn);
	scrolledColumns.push(childsColumn);
    });

    /* After scrolling card, parents, and children,
       there might be unscrolled column, because active card has no children in it.
       So make sure that every column is scrolled. */
    columns.map((c, i)=>{
	if (scrolledColumns.indexOf(c.index) == -1) {
	    /* console.log("Found unscrolled column " + c.index);*/
	    var firstCard = c.cardGroups[0].cards[0];
	    scrollTo(firstCard, c.index);
	    scrolledColumns.push(c.index);
	}
    });
    /* console.log("Scrolled columns " + scrolledColumns);    */
}
