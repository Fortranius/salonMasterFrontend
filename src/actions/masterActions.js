import {GET_MASTERS, ADD_MASTER} from "../constants/masterConstants";
import {getMasters} from "../service/masterService";

export const getMastersAction = (params) => dispatch => {
    getMasters(params).then(masters => {
        dispatch({
            type: GET_MASTERS,
            payload: masters
        })
    });
};