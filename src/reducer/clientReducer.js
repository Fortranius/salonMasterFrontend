import {GET_CLIENTS, ADD_CLIENT} from "../constants/clientConstants";

export default (state = {}, action) => {
    switch (action.type) {
        case GET_CLIENTS:
            return { ...state, clients:action.payload };
        case ADD_CLIENT:
            return { ...state, clients:action.payload };
        default:
            return state
    }
}