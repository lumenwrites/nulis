import { combineReducers } from 'redux';

import TreeReducer from './tree.reducer';
import AllTreesReducer from './trees.reducer';
import profiles from './profiles';

import undoable from 'redux-undo';

const rootReducer = combineReducers({
    tree: undoable(TreeReducer, { limit: 32 }),
    allTrees: AllTreesReducer,
    profiles: profiles    
});

export default rootReducer;

