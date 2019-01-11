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
import AsyncPaginate from 'react-select-async-paginate';
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

class Calendar extends Component {

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
            selectMaster: undefined
        };
        this.onOpenTimeSlotModal = this.onOpenTimeSlotModal.bind(this);
        this.onCloseTimeSlotModal = this.onCloseTimeSlotModal.bind(this);
        this.saveTimeSlot = this.saveTimeSlot.bind(this);
        this.onNavigate = this.onNavigate.bind(this);
        this.onSelectEvent = this.onSelectEvent.bind(this);
        this.handleInputMasterChange = this.handleInputMasterChange.bind(this);
        this.props.timeSlotActions(start, endFormat, undefined, new PageParams(0, 100));
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
            this.props.timeSlotActions(
                this.state.startWeek,
                this.state.endWeek,
                this.state.selectMaster ? this.state.selectMaster.master : undefined,
                new PageParams(0, 100));
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

        this.props.timeSlotActions(
            start,
            endFormat,
            this.state.selectMaster ? this.state.selectMaster.master : "",
            new PageParams(0, 100));

        this.setState({
            startWeek: start,
            endWeek: endFormat
        });
    };

    handleInputMasterChange = (newValue) => {
        this.props.timeSlotActions(
            this.state.startWeek,
            this.state.endWeek,
            newValue.master,
            new PageParams(0, 100));
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
                <div className="container" >
                    <div className="row">
                        <div className="col-sm-2">
                            ФИО мастера:
                        </div>
                        <div className={"col-sm-4 " + (this.state.open ? 'hide-select-master' : 'show-select-master')}>
                            <AsyncPaginate
                                value={this.state.selectMaster}
                                loadOptions={getOptionMasters}
                                onChange={this.handleInputMasterChange}
                                placeholder={'Выберите мастера'}
                            />
                        </div>
                        <div className="col-sm"/>
                    </div>
                </div>
                <hr/>
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
                    messages={{'today': "Текущая неделя", "previous":'Предыдущая неделя', "next":"Следующая неделя"}}
                />
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
    timeSlots: state.timeSlotReducer.timeSlots
});

function mapDispatchToProps(dispatch) {
    return {
        timeSlotActions: bindActionCreators(getTimeSlotsByDateAction, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Calendar);