import { combineReducers } from 'redux';
import undoable from 'redux-undo';

/* My reducers */
import TreeReducer from './tree.reducer';
import AllTreesReducer from './trees.reducer';
import ProfilesReducer from './profiles.reducer';
import PreferencesReducer from './preferences.reducer';

const rootReducer = combineReducers({
    tree: undoable(TreeReducer, { limit: 32 }),
    allTrees: AllTreesReducer,
    profiles: ProfilesReducer,
    preferences: PreferencesReducer
});

export default rootReducer;

