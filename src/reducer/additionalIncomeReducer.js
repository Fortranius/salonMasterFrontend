import {GET_ADDITIONAL_INCOME} from "../constants/additionalIncomeConstants";

export default (state = {}, action) => {
    switch (action.type) {
        case GET_ADDITIONAL_INCOME:
            return { ...state, incomes:action.payload };
        default:
            return state
    }
}