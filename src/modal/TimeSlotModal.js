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
import HistoryClients from "../components/HistoryClients";
import {getProducts, getProductsByDescription} from "../service/productService";
import ExpenseList from "./components/ExpenseItem";

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
            thousandSeparator={' '}
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

async function getOptionExpensesByDescription(search, loadedOptions) {
    let response;
    if (!search) response = await getProducts();
    else response = await getProductsByDescription(search);
    let cachedOptions = response.map((d) => ({
        value: d.id,
        label: d.description,
        product: d
    }));
    return {
        options: cachedOptions,
        hasMore: true
    };
}

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
            clients: [],
            menu:'MAIN',
            expense: {
                product: undefined,
                countProduct: 1
            },
            selectProductByDescription: undefined,
            submitExpense: false,
            expenses: []
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
        this.handleChangeExpense = this.handleChangeExpense.bind(this);
        this.setStatus = this.setStatus.bind(this);
    }

    componentDidMount() {
        let selectMasterName,
            selectMaster,
            selectClient,
            selectClientName = '',
            selectClientPhone = '',
            services,
            selectService,
            selectServiceByDescription = '',
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

            selectClientPhone = '+7 (' + this.props.event.timeSlot.client.person.phone.substring(0,3) + ') '
                + this.props.event.timeSlot.client.person.phone.substring(3, 6) + ' '
                + this.props.event.timeSlot.client.person.phone.substring(6, 8) + ' '
                + this.props.event.timeSlot.client.person.phone.substring(8, 10);
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
            selectServiceByDescription: selectServiceByDescription,
            menu:'MAIN',
            expenses: this.props.event.timeSlot ? this.props.event.timeSlot.expenses : []
        });
    }

    refused = () => {
        this.props.close();
        this.clear();
    };

    accept = () => {
        this.setState({
            submit: true,
            menu: 'MAIN'
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

        let expenses = this.state.expenses.map(expense => {
            return {
                id: expense.id,
                product: expense.product,
                countProduct: expense.countProduct,
                master: this.state.selectMaster,
                date: new Date()
            }
        });

        let timeSlot = {
            id: this.state.id,
            client: client,
            master: this.state.selectMaster,
            startSlot: startDate,
            endSlot: endDate,
            price: this.state.price,
            service: this.state.selectService,
            status: this.state.status,
            expenses: expenses
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
            clients:[],
            menu:'MAIN',
            expense: {
                product: undefined,
                countProduct: 1
            },
            selectProductByDescription: undefined,
            submitExpense: false,
            expenses: []
        });
    }

    handleInputMasterChange = (newValue) => {
        let options = newValue.master.services.map(service => {
            let maxPrice = service.maxPrice ? ' - ' + service.maxPrice + ' руб.': '';
            return {
                title: service.minPrice + ' руб.' + maxPrice,
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

    handleChangeExpense = name => event => {
        this.setState({
            expense: {
                ...this.state.expense,
                [name]: event.target.value
            }
        });
    };

    setStatus(status) {
        this.setState({
            status: status
        });
    }

    setMenu(menu) {
        this.setState({
            menu: menu
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
                    title: '+7 (' + client.person.phone.substring(0,3) + ') '
                        + client.person.phone.substring(3, 6) + ' '
                        + client.person.phone.substring(6, 8) + ' '
                        + client.person.phone.substring(8, 10),
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
        let phone = '';
        if (value.length<2) phone = value;
        else phone = value.substring(4);
        phone = phone.replace(/[.*-+?^${}()|[\]\\\s]/g, '');
        phone = phone.substring(0, 10);
        if (phone) getClientsByPhone(phone).then(clients => {
            let options = clients.map(client => {
                return {
                    title: '+7 (' + client.person.phone.substring(0,3) + ') '
                        + client.person.phone.substring(3, 6) + ' '
                        + client.person.phone.substring(6, 8) + ' '
                        + client.person.phone.substring(8, 10),
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
            let maxPrice = service.maxPrice ? ' - ' + service.maxPrice + ' руб.': '';
            return {
                title: service.minPrice + ' руб.' + maxPrice,
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
            let maxPrice = service.maxPrice ? ' - ' + service.maxPrice + ' руб.': '';
            return {
                title: service.minPrice + ' руб.' + maxPrice,
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
        let phone = '';
        if (newValue.length === 1) phone = '+7 (' + newValue;
        else if (newValue.length === 7) phone = newValue + ") ";
        else if (newValue.length === 12) phone = newValue + " ";
        else if (newValue.length === 15) phone = newValue + " ";
        else if (newValue.length > 18) return false;
        else phone = newValue;
        this.setState({
            selectClientPhone: phone,
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
            selectClientPhone: '+7 (' + suggestion.person.phone.substring(0,3) + ') '
                + suggestion.person.phone.substring(3, 6) + ' '
                + suggestion.person.phone.substring(6, 8) + ' '
                + suggestion.person.phone.substring(8, 10)
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

    handleInputProductChange = (newValue) => {
        this.setState({
            expense: {
                ...this.state.expense,
                product: newValue.product
            },
            selectProductByDescription: {
                value: newValue.value,
                label: newValue.product.description,
                product: newValue.product
            }
        });
    };

    addExpense = ()  => {
        this.setState({
            submitExpense: true
        });
        if (this.state.expense.product
            && this.state.expense.countProduct) {
            let expenses = this.state.expenses;
            expenses.push(this.state.expense);
            this.setState({
                selectProductByDescription: undefined,
                expenses: expenses,
                expense: {
                    product: undefined,
                    countProduct: 1
                },
                submitExpense:false
            });
        }
    };

    validateExpense(field) {
        if (!this.state.submitExpense)
            return false;
        return (!this.state.expense || !this.state.expense[field]);
    };

    removeExpense = (serviceIndex)  => {
        let array = [...this.state.expenses];
        array.splice(serviceIndex, 1);
        this.setState({expenses: array});
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
                    { this.props.event ? <div className="time_slot_modal">
                        <div className="row">
                            <div className="col-sm-2 time-slot-menu">
                                <ul>
                                    <li>
                                        <a href="#" onClick={() => this.setMenu('MAIN')}>Детали заказа</a>
                                    </li>
                                    <li>
                                        <a href="#" onClick={() => this.setMenu('EXPENSE')}>Расходы</a>
                                    </li>
                                    {this.state.selectClient ? <li>
                                        <a href="#" onClick={() => this.setMenu('HISTORY')}>История посещений</a>
                                    </li> : null}
                                </ul>
                            </div>
                            {this.state.menu === 'HISTORY' ? <div className="col-sm">
                                <div className="container selectDiv">
                                    <HistoryClients client={this.state.selectClient}/>
                                </div>
                            </div> : null}
                            {this.state.menu === 'EXPENSE' ? <div className="col-sm">
                                <div className="container selectDiv">
                                    <div className="row">
                                        <ExpenseList expenses={this.state.expenses} removeExpense={this.removeExpense}/>
                                    </div>
                                    <div className="row">
                                        <hr/>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-1 title-margin-date">
                                            Товар:
                                        </div>
                                        <div className="col-sm-4">
                                            <AsyncPaginate
                                                value={this.state.selectProductByDescription}
                                                loadOptions={getOptionExpensesByDescription}
                                                onChange={this.handleInputProductChange}
                                                placeholder={'Выберите товар'}
                                            />
                                            <FormControl className={classes.formControl} error={this.validateExpense('product')} aria-describedby="product-error-text">
                                                { this.validateExpense('product') ? <FormHelperText id="product-error-text">Поле не может быть пустым</FormHelperText>: null }
                                            </FormControl>
                                        </div>
                                        <div className="col-sm-2 title-margin-date">
                                            Количество:
                                        </div>
                                        <div className="col-sm-4">
                                            <TextField InputLabelProps={{ shrink: true }} value={this.state.expense.countProduct}
                                                       onChange={this.handleChangeExpense('countProduct')} type="number"/>

                                            <FormControl className={classes.formControl} error={this.validateExpense('countProduct')} aria-describedby="countProduct-error-text">
                                                { this.validateExpense('countProduct') ? <FormHelperText id="countProduct-error-text">Поле не может быть пустым</FormHelperText>: null }
                                            </FormControl>
                                        </div>
                                        <div className="col-sm-1">
                                            <button className="btn btn-default add-expense-button" onClick={this.addExpense}>+</button>
                                        </div>
                                    </div>
                                </div>
                            </div> : null}
                            {this.state.menu === 'MAIN' ? <div className="col-sm">
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
                                    </div>
                                    <hr/>
                                    <div className="row">
                                        <button onClick={() => this.setStatus('NEW')} className={"btn status-button " + (this.state.status === 'NEW' ? 'active-status-button' : '')}>
                                            Ожидание клиента
                                        </button>
                                        <button onClick={() => this.setStatus('DONE')} className={"btn status-button " + (this.state.status === 'DONE' ? 'active-status-button' : '')}>
                                            Клиент пришел
                                        </button>
                                        <button onClick={() => this.setStatus('CANCELED')} className={"btn status-button " + (this.state.status === 'CANCELED' ? 'active-status-button' : '')}>
                                            Клиент не пришел
                                        </button>
                                        <button onClick={() => this.setStatus('READY')} className={"btn status-button " + (this.state.status === 'READY' ? 'active-status-button' : '')}>
                                            Клиент подтвердил
                                        </button>
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
                                            Цена (руб.):
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
                            </div> : null}
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
