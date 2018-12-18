import {GET_TIME_SLOTS} from "../constants/timeSlotConstants";

export default (state = {timeSlots: []}, action) => {
    switch (action.type) {
        case GET_TIME_SLOTS:
            console.log(action.payload);
            return { ...state, timeSlots:[]};
        default:
            return state
    }
}