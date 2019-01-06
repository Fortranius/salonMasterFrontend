import {GET_TIME_SLOTS} from "../constants/timeSlotConstants";
import moment from "moment/moment";

export default (state = {timeSlots: []}, action) => {
    switch (action.type) {
        case GET_TIME_SLOTS:
            let evants = action.payload.map(timeSlot => {
                let event = {
                    id: timeSlot.id,
                    title: "Мастер: " + timeSlot.master.person.name
                    + " " + timeSlot.master.person.surname
                    + " " + timeSlot.master.person.patronymic
                    + " &#13;" + timeSlot.master.person.surname,
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