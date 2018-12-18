import {combineReducers} from 'redux';
import masterReducer from './masterReducer';
import clientReducer from './clientReducer';
import timeSlotReducer from './timeSlotReducer';

export default combineReducers({
    masterReducer,
    clientReducer,
    timeSlotReducer
});