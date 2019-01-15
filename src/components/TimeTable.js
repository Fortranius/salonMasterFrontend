import React, {Component} from 'react';
import '../App.css';
import BigCalendar from 'react-big-calendar'
import moment from 'moment'
import TimeSlotModal from "../modal/TimeSlotModal";
import {createTimeSlot, getTimeSlotsByDate} from "../service/timeSlotService";
import PageParams from "../model/PageParams";
import 'moment/locale/ru';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {getTimeSlotsByDateAction} from "../actions/timeSlotActions";
import {getMasters, getMastersByFiO} from "../service/masterService";

async function getOptionMasters(search, loadedOptions) {
    let response;
    if (!search) response = await getMasters(new PageParams(0, 100));
    else response = await getMastersByFiO(search);
    let cachedOptions = response.content.map((d) => ({
        value: d.id,
        label: d.person.name + " " + d.person.surname + " " + d.person.patronymic,
        master: d
    }));
    return {
        options: cachedOptions,
        hasMore: true,
    };
}

class TimeTable extends Component {

    constructor(props) {
        super(props);

        let end = moment().startOf('week').isoWeekday(7).toDate();
        end.setHours(23);
        end.setMinutes(59);
        end.setSeconds(59);

        let start = moment(moment().startOf('week').isoWeekday(1).toDate()).format('YYYY-MM-DD HH:mm:ss');
        let endFormat = moment(end).format('YYYY-MM-DD HH:mm:ss');

        this.state = {
            open: false,
            event: {},
            startWeek: start,
            endWeek: endFormat,
            selectMaster: undefined,
            timeSlots:undefined
        };
        this.onOpenTimeSlotModal = this.onOpenTimeSlotModal.bind(this);
        this.onCloseTimeSlotModal = this.onCloseTimeSlotModal.bind(this);
        this.saveTimeSlot = this.saveTimeSlot.bind(this);
        this.onNavigate = this.onNavigate.bind(this);
        this.onSelectEvent = this.onSelectEvent.bind(this);
        this.handleInputMasterChange = this.handleInputMasterChange.bind(this);
        this.setTimeSlots(start, endFormat, undefined);
    }

    setTimeSlots(start, end) {
        getTimeSlotsByDate(start, end).then(timeSlots => {
            let evants = timeSlots.map(timeSlot => {
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
            let resources = Array.from(new Set(timeSlots.map(s => s.master.id))).map(id => {
                let master = timeSlots.find(s => s.master.id === id).master;
                return {
                    id: id,
                    title: master.person.name,
                    master: master
                };
            });
            this.setState({
                timeSlots: {
                    evants: evants,
                    resources: resources
                }
            });
        });
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

    onOpenTimeSlotModal = (event) => {
        let master = this.state.timeSlots.resources.find(resource => resource.id === event.resourceId).master;
        console.log(master);
        this.setState({
            event: {
                start: event.start,
                end: event.end
            },
            selectMaster: {
                value: master.id,
                label: master.person.name + " " + master.person.surname + " " + master.person.patronymic,
                master: master
            },
            open: true
        });
    };

    saveTimeSlot(timeSlot) {
        createTimeSlot(timeSlot).then(() => {
            this.setTimeSlots(this.state.startWeek, this.state.endWeek);
            this.setState({
                open: false,
                event: {}
            });
        });
    };

    onNavigate(date, view) {
        let end = new Date(moment(date).endOf('isoWeek').toDate());
        end.setHours(23);
        end.setMinutes(59);
        end.setSeconds(59);

        let start = moment(new Date(moment(date).startOf('isoWeek').toDate())).format('YYYY-MM-DD HH:mm:ss');
        let endFormat = moment(end).format('YYYY-MM-DD HH:mm:ss');

        this.setTimeSlots(start, endFormat);

        this.setState({
            startWeek: start,
            endWeek: endFormat
        });
    };

    handleInputMasterChange = (newValue) => {
        this.setTimeSlots(this.state.startWeek, this.state.endWeek,);
        this.setState({
            selectMaster: {
                value: newValue.value.id,
                label: newValue.master.person.name + " " + newValue.master.person.surname + " " + newValue.master.person.patronymic,
                master: newValue.master
            }
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
            <div className="main-div">
                { this.state.timeSlots ? <BigCalendar
                    localizer={localizer}
                    events={this.state.timeSlots.evants}
                    resources={this.state.timeSlots.resources}
                    startAccessor="start"
                    endAccessor="end"
                    selectable={true}
                    defaultView={BigCalendar.Views.DAY}
                    min={new Date(2017, 10, 0, 10, 0, 0)}
                    max={new Date(2017, 10, 0, 22, 0, 0)}
                    views={{day: true}}
                    step={30}
                    toolbar={false}
                    timeslots={1}
                    onSelectEvent={this.onSelectEvent}
                    onSelectSlot={this.onOpenTimeSlotModal}
                    onNavigate={this.onNavigate}
                    eventPropGetter={
                        (event, start, end, isSelected) => {
                            let newStyle = {
                                backgroundColor: "lightgrey",
                                borderRadius: "0px",
                                border: "none"
                            };
                            if (event.timeSlot.status === 'NEW'){
                                newStyle.backgroundColor = "#df47fb"
                            }
                            if (event.timeSlot.status === 'CANCELED'){
                                newStyle.backgroundColor = "#f30808"
                            }
                            if (event.timeSlot.status === 'DONE'){
                                newStyle.backgroundColor = "#56CB51"
                            }
                            return {
                                style: newStyle
                            };
                        }
                    }
                />: null}
                {this.state.event.start ? <TimeSlotModal
                    accept={this.saveTimeSlot}
                    event={this.state.event}
                    selectMaster={this.state.selectMaster}
                    open={this.state.open}
                    close={this.onCloseTimeSlotModal}/>: null}
            </div>
        );
    }
}

const mapStateToProps = state => ({
    timeSlots: state.timeSlotReducer.timeSlots,
    resources: state.timeSlotReducer.resources
});

function mapDispatchToProps(dispatch) {
    return {
        timeSlotActions: bindActionCreators(getTimeSlotsByDateAction, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TimeTable);