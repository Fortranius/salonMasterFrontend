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
import Autosuggest from 'react-autosuggest';

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

async function getOptionMastersByFIO(search, loadedOptions) {
    let response;
    if (!search) response = await getMasters(new PageParams(0, 100));
    else response = await getMastersByFiO(search);
    let cachedOptions = response.content.map((d) => ({
        value: d.id,
        label: d.person.name,
        master: d
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

const getClientName = client => client.person.name;
const getClientPhone = client => client.person.phone;
const getServiceDescription = service => service.description;

const renderClient = client => {
    return (
        <span>{client.person.name}</span>
    );
};

const renderService = service => {
    return (
        <span>{service.description}</span>
    );
};

const renderSectionTitle = section => {
    return (
        <strong>{section.title}</strong>
    );
};

const getSectionClients = section => {
    return section.clients;
};

const getSectionServices = section => {
    return section.services;
};

class TimeSlotModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectService: undefined,
            selectServiceByDescription: '',
            selectMaster: undefined,
            selectMasterName: undefined,
            selectClient: undefined,
            selectClientName: '',
            selectClientPhone: '',
            startHour: { value: 10, label: '10' },
            startMinutes: { value: 0, label: '00' },
            endHour: { value: 10, label: '10' },
            endMinutes: { value: 0, label: '00' },
            date: new Date(),
            id: undefined,
            price: 0,
            status: 'NEW',
            value: '',
            services:[],
            clients: []
        };
        this.refused = this.refused.bind(this);
        this.accept = this.accept.bind(this);
        this.handleInputMasterChange = this.handleInputMasterChange.bind(this);
        this.handleChangeStartHour = this.handleChangeStartHour.bind(this);
        this.handleChangeStartMinutes = this.handleChangeStartMinutes.bind(this);
        this.handleChangeEndHour = this.handleChangeEndHour.bind(this);
        this.handleChangeEndMinutes = this.handleChangeEndMinutes.bind(this);
        this.handleChangeDate = this.handleChangeDate.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.setStatus = this.setStatus.bind(this);
    }

    componentDidMount() {
        let selectMasterName,
            selectMaster,
            selectClient,
            selectClientName,
            selectClientPhone,
            services,
            selectService,
            selectServiceByDescription,
            status;
        if (this.props.event.timeSlot) {
            selectMasterName = {
                value: this.props.event.timeSlot.master.id,
                label: this.props.event.timeSlot.master.person.name,
                master: this.props.event.timeSlot.master
            };
            selectMaster = this.props.event.timeSlot.master ? this.props.event.timeSlot.master : undefined;
            status = this.props.event.timeSlot.status ? this.props.event.timeSlot.status : 'NEW';
            selectClient = this.props.event.timeSlot.client;
            selectClientName = this.props.event.timeSlot.client.person.name;
            selectClientPhone = this.props.event.timeSlot.client.person.phone;
            selectService = this.props.event.timeSlot.service;
            selectServiceByDescription = this.props.event.timeSlot.service.description;
            services = this.props.event.timeSlot.master.services.map(service => {
                return {
                    title: service.description,
                    services: [
                        service
                    ]
                }
            });
        } else if (this.props.selectMaster) {
            services = this.props.selectMaster.master.services.map(service => {
                return {
                    title: service.description,
                    services: [
                        service
                    ]
                }
            });
            selectMasterName = {
                value: this.props.selectMaster.master.id,
                label: this.props.selectMaster.master.person.name,
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
            selectMasterName: selectMasterName,
            selectMaster: selectMaster,
            status: status ? status : 'NEW',

            selectClient: selectClient,
            selectClientName: selectClientName,
            selectClientPhone: selectClientPhone,
            services: services,
            selectService: selectService,
            selectServiceByDescription: selectServiceByDescription
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

        let client = this.state.selectClient;

        if (this.state.selectClientName && this.state.selectClientPhone) {
            if (!client)
                client = {
                    person: {
                        name: this.state.selectClientName,
                        phone: this.state.selectClientPhone
                    }
                }
        }

        if (!client || !this.state.selectMaster || !this.state.date || !this.state.selectService)
            return false;

        let startDate = new Date(this.state.date);
        startDate.setHours(this.state.startHour.value);
        startDate.setMinutes(this.state.startMinutes.value);
        let endDate = new Date(this.state.date);
        endDate.setHours(this.state.endHour.value);
        endDate.setMinutes(this.state.endMinutes.value);

        let timeSlot = {
            id: this.state.id,
            client: client,
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
            selectServiceByDescription: '',
            selectClient: undefined,
            selectMaster: undefined,
            selectMasterName: undefined,
            selectClientName: '',
            selectClientPhone: '',
            submit: false,
            startHour: { value: 10, label: '10' },
            startMinutes: { value: 0, label: '00' },
            endHour: { value: 10, label: '10' },
            endMinutes: { value: 0, label: '00' },
            date: new Date(),
            price: 0,
            status: 'NEW',
            services:[],
            clients:[]
        });
    }

    handleInputMasterChange = (newValue) => {
        let options = newValue.master.services.map(service => {
            let maxPrice = service.maxPrice ? ' - ' + service.maxPrice + '₽': '';
            return {
                title: service.minPrice + '₽' + maxPrice,
                services: [
                    service
                ]
            }
        });
        this.setState({
            selectMaster: newValue.master,
            services: options,
            selectService: undefined,
            selectServiceByDescription: '',
            selectMasterName: {
                value: newValue.value,
                label: newValue.master.person.name,
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

    onClientsFetchRequestedByName = ({ value }) => {
        getClientsByFiO(value).then(clients => {
            let options = clients.map(client => {
                return {
                    title: client.person.phone,
                    clients: [
                        client
                    ]
                }
            });
            this.setState({
                clients: options
            });
        });
    };

    onClientsFetchRequestedByPhone = ({ value }) => {
        getClientsByPhone(value).then(clients => {
            let options = clients.map(client => {
                return {
                    title: client.person.phone,
                    clients: [
                        client
                    ]
                }
            });
            this.setState({
                clients: options
            });
        });
    };

    onServicesByDescription = ({ value }) => {
        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;
        let options = this.state.selectMaster.services.filter(service =>
            service.description.toLowerCase().slice(0, inputLength) === inputValue
        ).map(service => {
            let maxPrice = service.maxPrice ? ' - ' + service.maxPrice + '₽': '';
            return {
                title: service.minPrice + '₽' + maxPrice,
                services: [
                    service
                ]
            }
        });
        this.setState({
            services: options
        });
    };

    onClientsClearRequested = () => {
        this.setState({
            clients: []
        });
    };

    onServicesClearRequested = () => {
        let options = this.state.selectMaster.services.map(service => {
            let maxPrice = service.maxPrice ? ' - ' + service.maxPrice + '₽': '';
            return {
                title: service.minPrice + '₽' + maxPrice,
                services: [
                    service
                ]
            }
        });
        this.setState({
            services: options
        });
    };

    onChangeClientName = (event, { newValue }) => {
        this.setState({
            selectClientName: newValue,
            selectClient: undefined
        });
    };

    onChangeClientPhone = (event, { newValue }) => {
        this.setState({
            selectClientPhone: newValue,
            selectClient: undefined
        });
    };

    onChangeServiceDescription = (event, { newValue }) => {
        this.setState({
            selectService: undefined,
            selectServiceByDescription: newValue
        });
    };

    onClientSelected = (event, { suggestion })  => {
        this.setState({
            selectClient: suggestion,
            selectClientName: suggestion.person.name,
            selectClientPhone: suggestion.person.phone
        });
    };

    onServiceSelected = (event, { suggestion })  => {
        this.setState({
            selectService: suggestion,
            price: suggestion.minPrice,
            selectServiceByDescription: suggestion.description
        });
    };

    shouldRenderSuggestions = (value) => {
        return value.trim().length > -1;
    };

    render() {
        const { classes } = this.props;
        const inputClientNameProps = {
            placeholder: 'Введите имя клиента',
            value:  this.state.selectClientName,
            onChange: this.onChangeClientName
        };
        const inputClientPhoneProps = {
            placeholder: 'Введите телефон клиента',
            value: this.state.selectClientPhone,
            onChange: this.onChangeClientPhone
        };

        const inputServiceProps = {
            placeholder: '',
            value: this.state.selectServiceByDescription,
            onChange: this.onChangeServiceDescription
        };
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
                                Имя клиента:
                            </div>
                        </div>

                        <Autosuggest
                            suggestions={this.state.clients}
                            multiSection={true}
                            onSuggestionsFetchRequested={this.onClientsFetchRequestedByName}
                            onSuggestionsClearRequested={this.onClientsClearRequested}
                            getSuggestionValue={getClientName}
                            renderSuggestion={renderClient}
                            renderSectionTitle={renderSectionTitle}
                            getSectionSuggestions={getSectionClients}
                            inputProps={inputClientNameProps}
                            onSuggestionSelected={this.onClientSelected}
                        />

                        <FormControl className={classes.formControl} error={this.validate('selectClientName')} aria-describedby="selectClientName-error-text">
                            { this.validate('selectClientName') ? <FormHelperText id="selectClientName-error-text">Поле не может быть пустым</FormHelperText>: null }
                        </FormControl>
                        <hr/>
                        <div className="row">
                            <div className="col-sm">
                                Телефон клиента:
                            </div>
                        </div>

                        <Autosuggest
                            suggestions={this.state.clients}
                            multiSection={true}
                            onSuggestionsFetchRequested={this.onClientsFetchRequestedByPhone}
                            onSuggestionsClearRequested={this.onClientsClearRequested}
                            getSuggestionValue={getClientPhone}
                            renderSuggestion={renderClient}
                            renderSectionTitle={renderSectionTitle}
                            getSectionSuggestions={getSectionClients}
                            inputProps={inputClientPhoneProps}
                            onSuggestionSelected={this.onClientSelected}
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
                            value={this.state.selectMasterName}
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
                                    {this.state.selectMaster ? <Autosuggest
                                        suggestions={this.state.services}
                                        multiSection={true}
                                        onSuggestionsFetchRequested={this.onServicesByDescription}
                                        onSuggestionsClearRequested={this.onServicesClearRequested}
                                        getSuggestionValue={getServiceDescription}
                                        renderSuggestion={renderService}
                                        renderSectionTitle={renderSectionTitle}
                                        getSectionSuggestions={getSectionServices}
                                        inputProps={inputServiceProps}
                                        onSuggestionSelected={this.onServiceSelected}
                                        focusInputOnSuggestionClick={true}
                                        shouldRenderSuggestions={this.shouldRenderSuggestions}
                                    />: null }
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
