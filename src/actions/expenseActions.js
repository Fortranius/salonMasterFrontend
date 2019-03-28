import {GET_EXPENSES} from "../constants/expenseConstants";
import {getExpenses} from "../service/expenseService";

export const getExpensesAction = (params, start, end) => dispatch => {
    getExpenses(params, start, end).then(expenses => {
        dispatch({
            type: GET_EXPENSES,
            payload: expenses
        })
    });
};