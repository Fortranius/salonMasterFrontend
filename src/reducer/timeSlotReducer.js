import {GET_TIME_SLOTS} from "../constants/timeSlotConstants";
import moment from "moment/moment";

export default (state = {timeSlots:[], resources:[]}, action) => {
    switch (action.type) {
        case GET_TIME_SLOTS:
            let evants = action.payload.map(timeSlot => {
                let event = {
                    id: timeSlot.id,
                    resourceId: timeSlot.master.id,
                    title: "\nМастер: " + timeSlot.master.person.name
                        + " " + timeSlot.master.person.surname
                        + " " + timeSlot.master.person.patronymic
                        + " \nКлиент: " + timeSlot.client.person.name
                        + " " + timeSlot.client.person.surname
                        + " " + timeSlot.client.person.patronymic
                        + " \nУслуга: " + timeSlot.service.description
                        + " Цена: " + timeSlot.price,
                    timeSlot: timeSlot,
                    start: moment.unix(timeSlot.startSlot).toDate(),
                    end: moment.unix(timeSlot.endSlot).toDate()
                };
                return event;
            });
            let resources = action.payload.map(timeSlot => {
                let resource = {
                    id: timeSlot.master.id,
                    title: timeSlot.master.person.name
                };
                return resource;
            });
            return {
                ...state,
                timeSlots:evants,
                resources:resources
            };
        default:
            return state
    }
}