import {GET_CLIENTS} from "../constants/clientConstants";

export default (state = {}, action) => {
    switch (action.type) {
        case GET_CLIENTS:
            return { ...state, clients:action.payload };
        default:
            return state
    }
}