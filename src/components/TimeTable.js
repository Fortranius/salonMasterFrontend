import React, {Component} from 'react';
import '../App.css';
import BigCalendar from 'react-big-calendar'
import moment from 'moment'
import TimeSlotModal from "../modal/TimeSlotModal";
import {createTimeSlot, getTimeSlotsByDate} from "../service/timeSlotService";
import 'moment/locale/ru';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {getTimeSlotsByDateAction} from "../actions/timeSlotActions";
import {allMastersByDayOff, allMastersByWorkDay} from "../service/masterService";
import Modal from 'react-responsive-modal';
import Select from 'react-select';
import {typeMasterFormatter} from "../data/formatter";

class TimeTable extends Component {

    constructor(props) {
        super(props);

        let start = moment().startOf('day').format('YYYY-MM-DD HH:mm:ss');
        let end =  moment().endOf('day').format('YYYY-MM-DD HH:mm:ss');

        this.state = {
            open: false,
            event: {},
            startWeek: start,
            endWeek: end,
            selectMaster: undefined,
            timeSlots:undefined,
            date: new Date(),
            openAddMaster: false,
            addMasterSelect: undefined,
            addMasterOptions: []
        };
        this.onOpenTimeSlotModal = this.onOpenTimeSlotModal.bind(this);
        this.onCloseTimeSlotModal = this.onCloseTimeSlotModal.bind(this);
        this.saveTimeSlot = this.saveTimeSlot.bind(this);
        this.onNavigate = this.onNavigate.bind(this);
        this.onSelectEvent = this.onSelectEvent.bind(this);
        this.handleInputMasterChange = this.handleInputMasterChange.bind(this);
        this.openModalMasterToGraph = this.openModalMasterToGraph.bind(this);
        this.closeModalMasterToGraph = this.closeModalMasterToGraph.bind(this);
        this.addMasterToGraph = this.addMasterToGraph.bind(this);
        this.handleChangeAddMaster = this.handleChangeAddMaster.bind(this);
        this.setTimeSlots = this.setTimeSlots.bind(this);

        this.setTimeSlots(start, end, undefined);
    }

    componentDidMount() {
        let date = this.props.location.search.substr(6);
        if (!date) return;
        this.setTimeSlots(date);
    }

    componentWillReceiveProps(newProps) {
        let date = newProps.location.search.substr(6);
        this.setTimeSlots(date);
    }

    setTimeSlots(date) {
        this.setState({
            timeSlots: undefined
        });
        let start = moment(new Date(moment(date).startOf('day').toDate())).format('YYYY-MM-DD HH:mm:ss');
        let end = moment(new Date(moment(date).endOf('day').toDate())).format('YYYY-MM-DD HH:mm:ss');
        getTimeSlotsByDate(start, end).then(timeSlots => {
            let evants = timeSlots.map(timeSlot => {
                return {
                    id: timeSlot.id,
                    resourceId: timeSlot.master.id,
                    title: "\nМастер: "+ timeSlot.master.person.name
                    + " \nКлиент: " + timeSlot.client.person.name
                    + " Цена: " + timeSlot.allPrice,
                    timeSlot: timeSlot,
                    start: moment.unix(timeSlot.startSlot).toDate(),
                    end: moment.unix(timeSlot.endSlot).toDate()
                };
            });
            allMastersByWorkDay(start).then(mastersWorkDay => {
                let resources = mastersWorkDay.map(master => {
                    return {
                        id: master.id,
                        title: master.person.name + " - " + typeMasterFormatter(master.type),
                        master: master
                    };
                });
                allMastersByDayOff(start).then(mastersWorkOff => {
                    let addMasterOptions = mastersWorkOff.map(master => {
                        return { value: master.id, label: master.person.name, master: master };
                    });
                    this.setState({
                        timeSlots: {
                            evants: evants,
                            resources: resources
                        },
                        addMasterOptions: addMasterOptions,
                        date: new Date(date),
                        startWeek: start,
                        endWeek: end
                    });
                });
            });
        });
    }

    onCloseTimeSlotModal = () => {
        this.setTimeSlots(this.state.startWeek, this.state.endWeek);
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
        this.setState({
            event: {
                start: event.start,
                end: event.end
            },
            selectMaster: {
                value: master.id,
                label: master.person.name,
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
                label: newValue.master.person.name,
                master: newValue.master
            }
        });
    };

    openModalMasterToGraph() {
        this.setState({
            openAddMaster: true
        });
    };

    closeModalMasterToGraph() {
        this.setState({
            openAddMaster: false
        });
    };

    handleChangeAddMaster = (newValue) => {
        this.setState({
            addMasterSelect: newValue
        });
    };

    addMasterToGraph() {
        let addMasterOptions = this.state.addMasterOptions.filter(
            master => {
                return master.value !== this.state.addMasterSelect.value
            }
        );
        let resources = this.state.timeSlots.resources;
        resources.push({
            id: this.state.addMasterSelect.master.id,
            title: this.state.addMasterSelect.master.person.name,
            master: this.state.addMasterSelect.master
        });

        this.setState((state) => {
            return {
                timeSlots: {
                    evants: state.timeSlots.evants,
                    resources: resources,
                },
                addMasterOptions: addMasterOptions,
                addMasterSelect: undefined,
                openAddMaster: false
            };
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
                <div className="button-group">
                    <button onClick = { this.openModalMasterToGraph } className="btn btn-primary">
                        Добавить мастера в расписание
                    </button>
                </div>
                <hr/>
                { this.state.timeSlots ? <BigCalendar
                    date={this.state.date}
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
                                backgroundColor: "rgb(104, 14, 14)",
                                borderRadius: "0px",
                                border: "none"
                            };
                            if (event.timeSlot.status === 'NEW'){
                                newStyle.backgroundColor = "gray"
                            }
                            if (event.timeSlot.status === 'CANCELED'){
                                newStyle.backgroundColor = "#f30808"
                            }
                            if (event.timeSlot.status === 'DONE'){
                                newStyle.backgroundColor = "rgb(39, 38, 42)"
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

                <Modal open={this.state.openAddMaster}
                       closeOnOverlayClick={true}
                       showCloseIcon={false}
                       onClose={this.closeModalMasterToGraph}
                       closeOnEsc={false} center={false}>
                    <div className="container add_master_modal">
                        <div className='row'>
                            <div className="col-sm">
                                <Select closeMenuOnSelect={false}
                                        value={this.state.addMasterSelect}
                                        onChange={this.handleChangeAddMaster}
                                        placeholder="Выберите мастера"
                                        options={this.state.addMasterOptions}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="button-group">
                        <button className="btn btn-primary" onClick={this.addMasterToGraph}>
                            Сохранить
                        </button>
                        <button className="btn btn-primary" onClick={this.closeModalMasterToGraph}>
                            Отмена
                        </button>
                    </div>
                </Modal>
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