import {GET_ALL_MASTERS, GET_MASTERS} from "../constants/masterConstants";

export default (state = {}, action) => {
    switch (action.type) {
        case GET_MASTERS:
            return { ...state, masters:action.payload };
        case GET_ALL_MASTERS:
            return { ...state, allMasters:action.payload };
        default:
            return state
    }
}