import {combineReducers} from 'redux';
import masterReducer from './masterReducer';
import clientReducer from './clientReducer';
import timeSlotReducer from './timeSlotReducer';
import expenseReducer from './expenseReducer';
import saleReducer from './saleReducer';
import incomingReducer from './incomingReducer';
import additionalIncomeReducer from './additionalIncomeReducer';

export default combineReducers({
    masterReducer,
    clientReducer,
    timeSlotReducer,
    expenseReducer,
    saleReducer,
    incomingReducer,
    additionalIncomeReducer
});