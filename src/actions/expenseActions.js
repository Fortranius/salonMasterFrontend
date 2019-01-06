import {GET_EXPENSES} from "../constants/expenseConstants";
import {getExpenses} from "../service/expenseService";

export const getExpensesAction = (params) => dispatch => {
    getExpenses(params).then(masters => {
        dispatch({
            type: GET_EXPENSES,
            payload: masters
        })
    });
};