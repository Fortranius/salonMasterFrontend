import {GET_INCOMINGS} from "../constants/incomingConstants";

export default (state = {}, action) => {
    switch (action.type) {
        case GET_INCOMINGS:
            return { ...state, incoming:action.payload };
        default:
            return state
    }
}