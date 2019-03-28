import {GET_SALES} from "../constants/saleConstants";

export default (state = {}, action) => {
    switch (action.type) {
        case GET_SALES:
            return { ...state, sales:action.payload };
        default:
            return state
    }
}