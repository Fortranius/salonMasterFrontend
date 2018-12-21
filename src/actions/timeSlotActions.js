import {GET_TIME_SLOTS} from "../constants/timeSlotConstants";
import {getTimeSlotsByDate} from "../service/timeSlotService";

export const getTimeSlotsByDateAction = (start, end, params) => dispatch => {
    getTimeSlotsByDate(start, end, params).then(timeSlots => {
        dispatch({
            type: GET_TIME_SLOTS,
            payload: timeSlots
        })
    });
};