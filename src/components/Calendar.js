import React, {Component} from 'react';
import '../App.css';
import BigCalendar from 'react-big-calendar'
import moment from 'moment'
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

        let end = moment().startOf('week').isoWeekday(7).toDate();
        end.setHours(23);
        end.setMinutes(59);
        end.setSeconds(59);

        let start = moment(moment().startOf('week').isoWeekday(1).toDate()).format('YYYY-MM-DD HH:mm:ss');
        let endFormat = moment(moment().startOf('week').isoWeekday(7).toDate()).format('YYYY-MM-DD HH:mm:ss');

        this.state = {
            open: false,
            event: {},
            startWeek: start,
            endWeek: endFormat
        };
        this.onOpenTimeSlotModal = this.onOpenTimeSlotModal.bind(this);
        this.onCloseTimeSlotModal = this.onCloseTimeSlotModal.bind(this);
        this.saveTimeSlot = this.saveTimeSlot.bind(this);
        this.onNavigate = this.onNavigate.bind(this);
        this.onSelectEvent = this.onSelectEvent.bind(this);
        this.props.timeSlotActions(start, endFormat, new PageParams(0, 10));
    }

    onCloseTimeSlotModal = () => {
        this.setState({
            open: false,
            event: {}
        });
    };

    onSelectEvent = (event) => {
        this.setState({
            event: event,
            open: true
        });
    };

    onOpenTimeSlotModal = ({start, end}) => {
        this.setState({
            event: {
                start: start,
                end: end
            },
            open: true
        });
    };

    saveTimeSlot(timeSlot) {
        createTimeSlot(timeSlot).then(() => {
            this.props.timeSlotActions(this.state.startWeek, this.state.endWeek, new PageParams(0, 10));
            this.setState({
                open: false,
                event: {}
            });
        });
    };

    onNavigate(date, view) {
        let end = new Date(moment(date).startOf('isoWeek').toDate());
        end.setHours(23);
        end.setMinutes(59);
        end.setSeconds(59);

        let start = moment(new Date(moment(date).startOf('isoWeek').toDate())).format('YYYY-MM-DD HH:mm:ss');
        let endFormat = moment(end).format('YYYY-MM-DD HH:mm:ss');

        this.props.timeSlotActions(start, endFormat, new PageParams(0, 10));

        this.setState({
            startWeek: start,
            endWeek: endFormat
        });
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
                    views={{week: true}}
                    onSelectEvent={this.onSelectEvent}
                    onSelectSlot={this.onOpenTimeSlotModal}
                    onNavigate={this.onNavigate}
                    messages={{'today': "Текущая неделя", "previous":'Предыдущая неделя', "next":"Следующая неделя"}}
                />
                {this.state.event.start ? <TimeSlotModal
                    accept={this.saveTimeSlot}
                    event={this.state.event}
                    open={this.state.open}
                    close={this.onCloseTimeSlotModal}/>: null}
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