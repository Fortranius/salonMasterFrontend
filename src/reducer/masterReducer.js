import {GET_MASTERS} from "../constants/masterConstants";

export default (state = {}, action) => {
    switch (action.type) {
        case GET_MASTERS:
            return { ...state, masters:action.payload };
        default:
            return state
    }
}