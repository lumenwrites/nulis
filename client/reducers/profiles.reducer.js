
var INITIAL_STATE = {
    user: "",
    error: ""
}
export default function(state=INITIAL_STATE, action) {
    switch(action.type) {
	case 'AUTH_USER':
	    return {...state, user: action.payload, error: "" };
	case 'UNAUTH_USER':
	    return {...state, user: "", error: "" };
	case 'AUTH_ERROR':
	    return {...state, error: action.payload };	    
    }

    return state;
}
