import React, {Component} from 'react';
import '../App.css';
import '../react-day-picker.css';
import Modal from 'react-responsive-modal';
import {withStyles} from '@material-ui/core/styles';
import AsyncPaginate from 'react-select-async-paginate';
import {getClientsByFiO, getClientsByPhone} from "../service/clientService";
import {getMasters, getMastersByFiO} from "../service/masterService";
import PageParams from "../model/PageParams";
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from 'react-select';
import hoursOptions from '../data/hoursOptions'
import minutesOptions from '../data/minutesOptions'
import DayPickerInput from 'react-day-picker/DayPickerInput';
import NumberFormat from 'react-number-format';
import TextField from '@material-ui/core/TextField';

import MomentLocaleUtils, {parseDate} from 'react-day-picker/moment';

import 'moment/locale/ru';
import {getServices, getServicesByDescription} from "../service/serviceService";

const styles = theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        marginTop: 16,
        width: 200
    },
    formControl: {
        display: 'flex'
    },
});

async function getOptionClientsByPhone(search, loadedOptions) {
    if (!search) return;
    const response = await getClientsByPhone(search);
    let cachedOptions = response.content.map((d) => ({
        value: d.id,
        label: d.person.phone,
        person: d
    }));
    return {
        options: cachedOptions,
        hasMore: true
    };
}

async function getOptionClientsByFIO(search, loadedOptions) {
    if (!search) return;
    const response = await getClientsByFiO(search);
    let cachedOptions = response.content.map((d) => ({
        value: d.id,
        label: d.person.name + " " + d.person.surname + " " + d.person.patronymic,
        client: d
    }));
    return {
        options: cachedOptions,
        hasMore: true
    };
}

async function getOptionMastersByFIO(search, loadedOptions) {
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
        hasMore: true
    };
}

async function getOptionServicesByDescription(search, loadedOptions) {
    let response;
    if (!search) response = await getServices();
    else response = await getServicesByDescription(search);
    let cachedOptions = response.map((d) => ({
        value: d.id,
        label: d.description,
        service: d
    }));
    return {
        options: cachedOptions,
        hasMore: true
    };
}

function NumberFormatCustom(props) {
    const { inputRef, onChange, ...other } = props;
    return (
        <NumberFormat
            {...other}
            getInputRef={inputRef}
            onValueChange={values => {
                onChange({
                    target: {
                        value: values.value,
                    },
                });
            }}
            thousandSeparator
            prefix="₽"
        />
    );
}

class TimeSlotModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectService: undefined,
            selectClient: undefined,
            selectMaster: undefined,
            selectMasterFio: undefined,
            selectClientFio: undefined,
            selectClientPhone: undefined,
            selectServiceByDescription: undefined,
            startHour: { value: 10, label: '10' },
            startMinutes: { value: 0, label: '00' },
            endHour: { value: 10, label: '10' },
            endMinutes: { value: 0, label: '00' },
            date: new Date(),
            id: undefined,
            price: 0,
            status: 'NEW'
        };
        this.refused = this.refused.bind(this);
        this.accept = this.accept.bind(this);
        this.handleInputClientChange = this.handleInputClientChange.bind(this);
        this.handleInputMasterChange = this.handleInputMasterChange.bind(this);
        this.handleInputServiceChange = this.handleInputServiceChange.bind(this);

        this.handleChangeStartHour = this.handleChangeStartHour.bind(this);
        this.handleChangeStartMinutes = this.handleChangeStartMinutes.bind(this);
        this.handleChangeEndHour = this.handleChangeEndHour.bind(this);
        this.handleChangeEndMinutes = this.handleChangeEndMinutes.bind(this);
        this.handleChangeDate = this.handleChangeDate.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleInputServiceChange = this.handleInputServiceChange.bind(this);
        this.setStatus = this.setStatus.bind(this);
    }

    componentDidMount() {
        let selectMasterFio,
            selectClientFio,
            selectClientPhone,
            selectMaster,
            selectService,
            selectServiceByDescription,
            status;
        if (this.props.event.timeSlot) {
            selectMasterFio = {
                value: this.props.event.timeSlot.master.id,
                label: this.props.event.timeSlot.master.person.name
                    + " " + this.props.event.timeSlot.master.person.surname
                    + " " + this.props.event.timeSlot.master.person.patronymic,
                master: this.props.event.timeSlot.master
            };
            selectClientFio = {
                value: this.props.event.timeSlot.client.id,
                label: this.props.event.timeSlot.client.person.name
                    + " " + this.props.event.timeSlot.client.person.surname
                    + " " + this.props.event.timeSlot.client.person.patronymic,
                client: this.props.event.timeSlot.client
            };
            selectClientPhone = {
                value: this.props.event.timeSlot.client.id,
                label: this.props.event.timeSlot.client.person.phone,
                client: this.props.event.timeSlot.client
            };
            if (this.props.event.timeSlot.service)
                selectServiceByDescription = {
                    value: this.props.event.timeSlot.service.id,
                    label: this.props.event.timeSlot.service.description,
                    service: this.props.event.timeSlot.service
                };
            selectMaster = this.props.event.timeSlot.master ? this.props.event.timeSlot.master : undefined;
            selectService = this.props.event.timeSlot.service ? this.props.event.timeSlot.service : undefined;
            status = this.props.event.timeSlot.status ? this.props.event.timeSlot.status : 'NEW';
        } else if (this.props.selectMaster) {
            selectMasterFio = {
                value: this.props.selectMaster.master.id,
                label: this.props.selectMaster.master.person.name
                + " " + this.props.selectMaster.master.person.surname
                + " " + this.props.selectMaster.master.person.patronymic,
                master: this.props.selectMaster.master
            };
            selectMaster = this.props.selectMaster.master;
        }
        this.setState({
            date: this.props.event.start,
            id: this.props.event.id,
            price: this.props.event.timeSlot ? this.props.event.timeSlot.price : 0,
            startHour: {
                value: this.props.event.start.getHours(),
                label: this.props.event.start.getHours()
            },
            startMinutes: {
                value: this.props.event.start.getMinutes(),
                label: this.props.event.start.getMinutes().toString().length < 2 ? '0' +
                    this.props.event.start.getMinutes().toString():this.props.event.start.getMinutes()
            },
            endHour: {
                value: this.props.event.end.getHours(),
                label: this.props.event.end.getHours()
            },
            endMinutes: {
                value: this.props.event.end.getMinutes(),
                label: this.props.event.end.getMinutes().toString().length < 2 ? '0' +
                    this.props.event.end.getMinutes().toString():this.props.event.end.getMinutes()
            },
            selectMasterFio: selectMasterFio,
            selectClientFio: selectClientFio,
            selectClientPhone: selectClientPhone,
            selectServiceByDescription : selectServiceByDescription,
            selectClient: this.props.event.timeSlot ? this.props.event.timeSlot.client : undefined,
            selectMaster: selectMaster,
            selectService: selectService,
            status: status ? status : 'NEW'
        });
    }

    refused = () => {
        this.props.close();
        this.clear();
    };

    accept = () => {
        this.setState({
            submit: true
        });

        if (!this.state.selectClient || !this.state.selectMaster || !this.state.date || !this.state.selectService)
            return false;

        let startDate = new Date(this.state.date);
        startDate.setHours(this.state.startHour.value);
        startDate.setMinutes(this.state.startMinutes.value);
        let endDate = new Date(this.state.date);
        endDate.setHours(this.state.endHour.value);
        endDate.setMinutes(this.state.endMinutes.value);

        let timeSlot = {
            id: this.state.id,
            client: this.state.selectClient,
            master: this.state.selectMaster,
            startSlot: startDate,
            endSlot: endDate,
            price: this.state.price,
            service: this.state.selectService,
            status: this.state.status
        };
        this.props.accept(timeSlot);
        this.clear();
    };

    clear() {
        this.setState({
            selectService: undefined,
            selectClient: undefined,
            selectMaster: undefined,
            selectMasterFio: undefined,
            selectClientFio: undefined,
            selectClientPhone: undefined,
            submit: false,
            startHour: { value: 10, label: '10' },
            startMinutes: { value: 0, label: '00' },
            endHour: { value: 10, label: '10' },
            endMinutes: { value: 0, label: '00' },
            date: new Date(),
            price: 0,
            status: 'NEW'
        });
    }

    handleInputServiceChange = (newValue) => {
        this.setState({
            selectService: newValue.service,
            selectServiceByDescription: {
                value: newValue.value,
                label: newValue.service.description,
                service: newValue.service
            },
            price: newValue.service.minPrice
        });
    };

    handleInputClientChange = (newValue) => {
        this.setState({
            selectClient: newValue.client,
            selectClientFio: {
                value: newValue.value,
                label: newValue.client.person.name + " " + newValue.client.person.surname + " " + newValue.client.person.patronymic,
                client: newValue.client
            },
            selectClientPhone: {
                value: newValue.value,
                label: newValue.client.person.phone,
                client: newValue.client
            }
        });
    };

    handleInputMasterChange = (newValue) => {
        this.setState({
            selectMaster: newValue.master,
            selectMasterFio: {
                value: newValue.value,
                label: newValue.master.person.name + " " + newValue.master.person.surname + " " + newValue.master.person.patronymic,
                master: newValue.master
            }
        });
    };

    handleChangeStartHour = (newValue) => {
        this.setState({
            startHour: newValue
        });
    };
    handleChangeStartMinutes = (newValue) => {
        this.setState({
            startMinutes: newValue
        });
    };
    handleChangeEndHour = (newValue) => {
        this.setState({
            endHour: newValue
        });
    };
    handleChangeEndMinutes = (newValue) => {
        this.setState({
            endMinutes: newValue
        });
    };

    handleChangeDate = (newValue) => {
        this.setState({
            date: newValue
        });
    };

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value
        });
    };

    setStatus(status) {
        this.setState({
            status: status
        });
    }

    validate(field) {
        if (!this.state.submit)
            return false;
        return (!this.state || !this.state[field]);
    }

    render() {
        const { classes } = this.props;
        return (
            <div>
                <Modal open={this.props.open}
                       closeOnOverlayClick={false}
                       showCloseIcon={false}
                       onClose={this.refused}
                       closeOnEsc={false} center={false}>
                    { this.props.event ? <div>
                        <div className="container selectDiv">
                            <div className="row">
                                <div className="col-sm-2 title-margin-date">
                                    Дата заказа:
                                </div>
                                <div className="col-sm">
                                    <DayPickerInput
                                        placeholder={`Дата заказа`}
                                        parseDate={parseDate}
                                        value={this.state.date}
                                        onDayChange={this.handleChangeDate}
                                        dayPickerProps={{
                                            locale: 'ru',
                                            localeUtils: MomentLocaleUtils,
                                        }}/>
                                </div>
                                <div className="col-sm">
                                    <button onClick={() => this.setStatus('NEW')} className={"btn status-button " + (this.state.status === 'NEW' ? 'active-status-button' : '')}>
                                        Новый
                                    </button>
                                    <button onClick={() => this.setStatus('CANCELED')} className={"btn status-button " + (this.state.status === 'CANCELED' ? 'active-status-button' : '')}>
                                        Отменен
                                    </button>
                                    <button onClick={() => this.setStatus('DONE')} className={"btn status-button " + (this.state.status === 'DONE' ? 'active-status-button' : '')}>
                                        Завершен
                                    </button>
                                </div>
                            </div>
                            <hr/>
                            <div className="row">
                                <div className="col-sm-2 title-margin">
                                    Время начала:
                                </div>
                                <div className="col-sm">
                                    <div className="inlineDiv">
                                        <Select
                                            value={this.state.startHour}
                                            options={hoursOptions}
                                            placeholder={''}
                                            onChange={this.handleChangeStartHour}
                                            className='selectStyle'
                                        />
                                        <div className="quote">:</div>
                                        <Select
                                            value={this.state.startMinutes}
                                            options={minutesOptions}
                                            placeholder={''}
                                            onChange={this.handleChangeStartMinutes}
                                            className='selectStyle'
                                        />
                                    </div>
                                </div>
                                <div className="col-sm-2">
                                    Время завершения:
                                </div>
                                <div className="col-sm">
                                    <div className="inlineDiv">
                                        <Select
                                            value={this.state.endHour}
                                            options={hoursOptions}
                                            placeholder={''}
                                            onChange={this.handleChangeEndHour}
                                            className='selectStyle'
                                        />
                                        <div className="quote">:</div>
                                        <Select
                                            value={this.state.endMinutes}
                                            options={minutesOptions}
                                            placeholder={''}
                                            onChange={this.handleChangeEndMinutes}
                                            className='selectStyle'
                                        />
                                    </div>
                                </div>
                            </div>
                            <hr/>
                        </div>
                        <hr/>
                        <div className="row">
                            <div className="col-sm">
                                ФИО клиента:
                            </div>
                        </div>
                        <AsyncPaginate
                            value={this.state.selectClientFio}
                            loadOptions={getOptionClientsByFIO}
                            onChange={this.handleInputClientChange}
                            placeholder={'Выберите ФИО клиента'}
                        />
                        <FormControl className={classes.formControl} error={this.validate('selectClient')} aria-describedby="selectClient-error-text">
                            { this.validate('selectClient') ? <FormHelperText id="selectClient-error-text">Поле не может быть пустым</FormHelperText>: null }
                        </FormControl>
                        <hr/>
                        <div className="row">
                            <div className="col-sm">
                                Телефон клиента:
                            </div>
                        </div>
                        <AsyncPaginate
                            value={this.state.selectClientPhone}
                            loadOptions={getOptionClientsByPhone}
                            onChange={this.handleInputClientChange}
                            placeholder={'Выберите телефон клиента'}
                        />
                        <FormControl className={classes.formControl} error={this.validate('selectClientPhone')} aria-describedby="selectClientPhone-error-text">
                            { this.validate('selectClientPhone') ? <FormHelperText id="selectClientPhone-error-text">Поле не может быть пустым</FormHelperText>: null }
                        </FormControl>
                        <hr/>
                        <div className="row">
                            <div className="col-sm">
                                Мастер:
                            </div>
                        </div>
                        <AsyncPaginate
                            value={this.state.selectMasterFio}
                            loadOptions={getOptionMastersByFIO}
                            onChange={this.handleInputMasterChange}
                            placeholder={'Выберите мастера'}
                        />
                        <FormControl className={classes.formControl} error={this.validate('selectMaster')} aria-describedby="selectMaster-error-text">
                            { this.validate('selectMaster') ? <FormHelperText id="selectMaster-error-text">Поле не может быть пустым</FormHelperText>: null }
                        </FormControl>
                        <hr/>
                        <div className="container">
                            <div className="row">
                                <div className="col-sm-2 title-margin">
                                    Услуга:
                                </div>
                                <div className="col-sm">
                                    <AsyncPaginate
                                        value={this.state.selectServiceByDescription}
                                        loadOptions={getOptionServicesByDescription}
                                        onChange={this.handleInputServiceChange}
                                        placeholder={'Выберите услугу'}
                                    />
                                    <FormControl className={classes.formControl} error={this.validate('selectService')} aria-describedby="selectService-error-text">
                                        { this.validate('selectService') ? <FormHelperText id="selectService-error-text">Поле не может быть пустым</FormHelperText>: null }
                                    </FormControl>
                                </div>
                                <div className="col-sm-2 title-margin-date">
                                    Цена:
                                </div>
                                <div className="col-sm">
                                    <TextField
                                        className={classes.formControl}
                                        value={this.state.price}
                                        onChange={this.handleChange('price')}
                                        InputProps={{
                                            inputComponent: NumberFormatCustom,
                                        }}
                                    />
                                </div>
                            </div>
                            <hr/>
                        </div>
                        </div>: null }
                    <div className="button-group">
                        <button className="btn btn-primary" onClick={this.accept}>
                            Сохранить
                        </button>
                        <button className="btn btn-primary" onClick={this.refused}>
                            Отмена
                        </button>
                    </div>
                </Modal>
            </div>
        );
    }
}

export default withStyles(styles)(TimeSlotModal);
