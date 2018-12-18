import React, {Component} from 'react';
import '../App.css';
import BigCalendar from 'react-big-calendar'
import moment from 'moment'
import events from '../data/events'
import TimeSlotModal from "../modal/TimeSlotModal";
import {createTimeSlot} from "../service/timeSlotService";
import PageParams from "../model/PageParams";
import 'moment/locale/ru';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {getTimeSlotsByDateAction} from "../actions/timeSlotActions";

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
        this.onOpenTimeSlotModal = this.onOpenTimeSlotModal.bind(this);
        this.onCloseTimeSlotModal = this.onCloseTimeSlotModal.bind(this);
        this.saveTimeSlot = this.saveTimeSlot.bind(this);
        this.onNavigate = this.onNavigate.bind(this);
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

    onNavigate(date, view) {
        let start = moment(new Date(moment(date).startOf('isoWeek').toDate())).format('YYYY-MM-DD HH:mm:ss');
        let end = moment(new Date(moment(date).startOf('isoWeek').toDate())).format('YYYY-MM-DD HH:mm:ss');

        this.props.timeSlotActions(start, end, new PageParams(0, 10));

        return {start, end};
    };

    render() {
        moment.locale("ru", {
            week: {
                dow: 1
            }
        });
        const localizer = BigCalendar.momentLocalizer(moment);
        return (
            <div>
                <BigCalendar
                    localizer={localizer}
                    events={this.props.timeSlots}
                    startAccessor="start"
                    endAccessor="end"
                    selectable={true}
                    defaultView={BigCalendar.Views.WEEK}
                    min={new Date(2017, 10, 0, 10, 0, 0)}
                    max={new Date(2017, 10, 0, 22, 0, 0)}
                    views={{week: true, day: true}}
                    onSelectEvent={event => alert(event.title)}
                    onSelectSlot={this.onOpenTimeSlotModal}
                    onNavigate={this.onNavigate}
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

const mapStateToProps = state => ({
    timeSlots: state.timeSlotReducer.timeSlots
});

function mapDispatchToProps(dispatch) {
    return {
        timeSlotActions: bindActionCreators(getTimeSlotsByDateAction, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Calendar);