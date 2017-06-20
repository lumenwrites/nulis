
var INITIAL_STATE = {
    maxColumns: 5,
    theme: "Light",
    showModal: "upgrade"
}

export default function(state=INITIAL_STATE, action) {
    switch(action.type) {
	case 'SET_MAX_COLUMNS':
	    return {...state, maxColumns: action.payload};
	case 'SET_SHOW_MODAL':
	    console.log("Show modal " + action.payload);
	    return {...state, showModal: action.payload};
	default:
	    return state;
    }
}
