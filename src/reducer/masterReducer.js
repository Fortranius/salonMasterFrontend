import {getMasters} from "../service/masterService";

export default (state = {masters: []}, action) => {
    switch (action.type) {
        case 'GET_MASTERS':
            return { ...state, masters:getMasters() };
        default:
            return state
    }
}