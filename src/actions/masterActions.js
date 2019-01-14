import {GET_ALL_MASTERS, GET_MASTERS} from "../constants/masterConstants";
import {getAllMasters, getMasters} from "../service/masterService";

export const getMastersAction = (params) => dispatch => {
    getMasters(params).then(masters => {
        dispatch({
            type: GET_MASTERS,
            payload: masters
        })
    });
};

export const getAllMastersAction = () => dispatch => {
    getAllMasters().then(masters => {
        dispatch({
            type: GET_ALL_MASTERS,
            payload: masters
        })
    });
};