import axios from 'axios';
import { browserHistory } from 'react-router';

import {API_URL} from './cards.actions';


export function setShowModal(modal) {
    return {
	type: 'SET_SHOW_MODAL',
	payload: modal
    };
}
