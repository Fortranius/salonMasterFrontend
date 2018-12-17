import React, {Component} from 'react';
import '../App.css';
import BigCalendar from 'react-big-calendar'
import moment from 'moment'
import events from '../data/events'
import TimeSlotModal from "../modal/TimeSlotModal";
import {createTimeSlot, getTimeSlotsByDate} from "../service/timeSlotService";
import PageParams from "../model/PageParams";

class Calendar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            events: events,
            open: false,
            timeSlot: {
                start: undefined,
                end: undefined
            }
        };

        getTimeSlotsByDate(new Date(), new Date(), new PageParams(0, 10)).then(data => {
            console.log('11111111 ', data);
        });

        this.onOpenTimeSlotModal = this.onOpenTimeSlotModal.bind(this);
        this.onCloseTimeSlotModal = this.onCloseTimeSlotModal.bind(this);
        this.saveTimeSlot = this.saveTimeSlot.bind(this);
    }

    onCloseTimeSlotModal = () => {
        this.setState({
            open: false
        });
    };

    onOpenTimeSlotModal = ({start, end}) => {
        this.setState({
            timeSlot: {
                start: start,
                end: end
            },
            open: true
        });
    };

    saveTimeSlot(timeSlot) {
        createTimeSlot(timeSlot).then(() => {
            this.setState({
                open: false
            });
        });
    };

    render() {
        const localizer = BigCalendar.momentLocalizer(moment);
        return (
            <div>
                <BigCalendar
                    localizer={localizer}
                    events={this.state.events}
                    startAccessor="start"
                    endAccessor="end"
                    selectable={true}
                    defaultView={BigCalendar.Views.WEEK}
                    min={new Date(2017, 10, 0, 10, 0, 0)}
                    max={new Date(2017, 10, 0, 22, 0, 0)}
                    views={{week: true, day: true}}
                    onSelectEvent={event => alert(event.title)}
                    onSelectSlot={this.onOpenTimeSlotModal}
                />
                <TimeSlotModal accept={this.saveTimeSlot}
                               open={this.state.open} start={this.state.timeSlot.start}
                               end={this.state.timeSlot.end}
                               close={this.onCloseTimeSlotModal}
                               entity="клиента"/>
            </div>
        );
    }
}

export default Calendar;
