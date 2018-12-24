import {GET_TIME_SLOTS} from "../constants/timeSlotConstants";
import moment from "moment/moment";

export default (state = {timeSlots: []}, action) => {
    switch (action.type) {
        case GET_TIME_SLOTS:
            let evants = action.payload.map(timeSlot => {
                let event = {
                    id: timeSlot.id,
                    title: timeSlot.master.person.name,
                    timeSlot: timeSlot,
                    start: moment.unix(timeSlot.startSlot).toDate(),
                    end: moment.unix(timeSlot.endSlot).toDate(),
                };
                return event;
            });
            return { ...state, timeSlots:evants};
        default:
            return state
    }
}