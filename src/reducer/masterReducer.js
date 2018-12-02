import {GET_MASTERS, ADD_MASTER} from "../constants/masterConstants";

export default (state = {}, action) => {
    switch (action.type) {
        case GET_MASTERS:
            return { ...state, masters:action.payload };
        case ADD_MASTER:
            return { ...state, masters:action.payload };
        default:
            return state
    }
}