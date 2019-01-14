import {GET_EXPENSES} from "../constants/expenseConstants";

export default (state = {}, action) => {
    switch (action.type) {
        case GET_EXPENSES:
            return { ...state, expenses:action.payload };
        default:
            return state
    }
}