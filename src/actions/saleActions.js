import {GET_SALES} from "../constants/saleConstants";
import {getSales} from "../service/saleService";

export const getSalesAction = (params) => dispatch => {
    getSales(params).then(sales => {
        dispatch({
            type: GET_SALES,
            payload: sales
        })
    });
};