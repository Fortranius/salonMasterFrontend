import {GET_ADDITIONAL_INCOME} from "../constants/additionalIncomeConstants";
import {getAdditionalIncomes} from "../service/additionalIncomeService";

export const getAdditionalIncomesAction = (params, start, end) => dispatch => {
    getAdditionalIncomes(params, start, end).then(incomes => {
        dispatch({
            type: GET_ADDITIONAL_INCOME,
            payload: incomes
        })
    });
};