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

export function setCardColor(color) {
    /* unused */
    return {
	type: 'SET_CARD_COLOR',
	payload: color
    }
}
export function setCardConfig(boolean) {
    /* unused */
    return {
	type: 'SET_CARD_CONFIG',
	payload: boolean
    }
}

export function checkCheckbox(index, cardId) {
    /* unused */
    return {
	type: 'CHECKBOX',
	payload: {index:index, cardId:cardId}
    }
}



export function createCard(direction, card) {
    var cardsCreated = 0;
    if(localStorage.getItem('cardsCreated')){
	cardsCreated = parseInt(localStorage.getItem('cardsCreated'));
    }
    localStorage.setItem('cardsCreated', (cardsCreated+1));
    
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
    var prevWordcount = card.content.split(' ').length;
    var currentWordcount =  content.split(' ').length;
    card.content = content;
    return function(dispatch) {
	dispatch({
	    type: 'UPDATE_CARD',
	    payload: card
	});
	if (currentWordcount > prevWordcount) {
	    dispatch({
		type: 'ADD_WORD'
	    });
	}
    }
}

export function deleteCard(card) {
    /* console.log("Card deleted " + JSON.stringify(card));    */
    return {
	type: 'DELETE_CARD',
	payload: card
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

