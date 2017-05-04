
export default function(state={user:{},authenticated:false, email:""}, action) {
    switch(action.type) {
	case 'AUTH_USER':
	    return {...state, error: '', authenticated: true };
	case 'UPDATE_USER':
	    return {...state, user: action.payload };
	case 'UNAUTH_USER':
	    return {...state, error: '', authenticated: false };
	case 'AUTH_ERROR':
	    return {...state, error: action.payload };
	case 'FETCH_MESSAGE':
	    return {...state, message: action.payload };
    }

    return state;
}
