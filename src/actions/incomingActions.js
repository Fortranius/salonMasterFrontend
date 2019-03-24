import {getIncomings} from "../service/incomingService";
import {GET_INCOMINGS} from "../constants/incomingConstants";

export const getIncomingAction = (params, start, end) => dispatch => {
    getIncomings(params, start, end).then(incoming => {
        dispatch({
            type: GET_INCOMINGS,
            payload: incoming
        })
    });
};