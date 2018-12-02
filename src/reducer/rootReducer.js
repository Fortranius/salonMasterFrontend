import { combineReducers } from 'redux';
import masterReducer from './masterReducer';
import clientReducer from './clientReducer';

export default combineReducers({
    masterReducer,
    clientReducer
});