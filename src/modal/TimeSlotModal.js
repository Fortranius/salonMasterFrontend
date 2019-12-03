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
import DayPickerInput from 'react-day-picker/DayPickerInput';
import NumberFormat from 'react-number-format';
import TextField from '@material-ui/core/TextField';

import MomentLocaleUtils, {parseDate} from 'react-day-picker/moment';
import 'moment/locale/ru';
import Autosuggest from 'react-autosuggest';
import HistoryClients from "../components/HistoryClients";
import {getAllHairCategories, getAllHairs} from "../service/hairService";
import HistoryChangeSlot from "../components/HistoryChangeSlot";
import {hourOptions, minuteOptions} from "../data/selectOptions";
import {phoneFormatterToString, typeMasterFormatter} from "../data/formatter";
import {createTimeSlot, deleteTimeSlot} from "../service/timeSlotService";

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
    formControlHairs: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        marginTop:16,
        width: 250
    }
});

async function getOptionMastersByFIO(search, loadedOptions) {
    let response;
    if (!search) response = await getMasters(new PageParams(0, 100));
    else response = await getMastersByFiO(search);
    let cachedOptions = response.content.map((d) => ({
        value: d.id,
        label: d.person.name + " - " + typeMasterFormatter(d.type),
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

const renderClient = client => {
    return (
        <span>{client.person.name}</span>
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

class TimeSlotModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectMaster: undefined,
            selectMasterName: undefined,
            selectClient: undefined,
            selectClientName: '',
            selectClientPhone: '',
            clientDescription: '',
            startHour: { value: 10, label: '10' },
            startMinutes: { value: 0, label: '00' },
            endHour: { value: 10, label: '10' },
            endMinutes: { value: 0, label: '00' },
            date: new Date(),
            id: undefined,
            allPrice: 0,
            masterWorkPrice: 0,
            status: 'NEW',
            value: '',
            clients: [],
            menu:'MAIN',
            selectProductByDescription: undefined,
            optionHairs: [],
            selectedHair: undefined,
            hairWeight: 0,
            hairCountExtension: 0,
            hairCountRemoval: 0,
            hairsCategory: [],
            procedures: [],
            submitProcedure: false,
            selectedProcedures: [],
            optionProcedures: []
        };
        this.refused = this.refused.bind(this);
        this.accept = this.accept.bind(this);
        this.delete = this.delete.bind(this);
        this.handleInputMasterChange = this.handleInputMasterChange.bind(this);
        this.handleChangeStartHour = this.handleChangeStartHour.bind(this);
        this.handleChangeStartMinutes = this.handleChangeStartMinutes.bind(this);
        this.handleChangeEndHour = this.handleChangeEndHour.bind(this);
        this.handleChangeEndMinutes = this.handleChangeEndMinutes.bind(this);
        this.handleChangeDate = this.handleChangeDate.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeHair = this.handleChangeHair.bind(this);
        this.setStatus = this.setStatus.bind(this);
        this.handleChangeProcedures = this.handleChangeProcedures.bind(this);

        getAllHairs().then(data => {
            let hairs = data.map(hair => {
                return { value: hair.id, label: "Волосы " + hair.minLength + " - " + (hair.maxLength !== 0 ? hair.maxLength : "более"), hair: hair };
            });
            this.setState({
                optionHairs: hairs
            });
        });

        getAllHairCategories().then(data => {
            this.setState({
                hairsCategory: data
            })
        });
    }

    componentDidMount() {
        let selectMasterName,
            selectMaster,
            selectClient,
            selectClientName = '',
            selectClientPhone = '',
            clientDescription = '',
            status,
            selectedHair,
            procedures = [],
            selectedProcedures = [];
        if (this.props.event.timeSlot) {
            selectedProcedures = this.props.event.timeSlot.procedures.map(procedure => {
                return { value: procedure.id, label: procedure.description, procedure: procedure };
            });
            procedures = this.props.event.timeSlot.procedures;
            selectMasterName = {
                value: this.props.event.timeSlot.master.id,
                label: this.props.event.timeSlot.master.person.name + " - " + typeMasterFormatter(this.props.event.timeSlot.master.type),
                master: this.props.event.timeSlot.master
            };
            if (this.props.event.timeSlot.hair)
                selectedHair = {
                    value: this.props.event.timeSlot.hair.id,
                    label: "Волосы " + this.props.event.timeSlot.hair.minLength + " - " +
                        (this.props.event.timeSlot.hair.maxLength !== 0 ? this.props.event.timeSlot.hair.maxLength : "более"),
                    hair: this.props.event.timeSlot.hair
                };
            selectMaster = this.props.event.timeSlot.master ? this.props.event.timeSlot.master : undefined;
            status = this.props.event.timeSlot.status ? this.props.event.timeSlot.status : 'NEW';
            selectClient = this.props.event.timeSlot.client;
            selectClientName = this.props.event.timeSlot.client.person.name;
            clientDescription = this.props.event.timeSlot.client.description ? this.props.event.timeSlot.client.description : '';

            selectClientPhone = phoneFormatterToString(this.props.event.timeSlot.client.person.phone);
        } else if (this.props.selectMaster) {
            selectMasterName = {
                value: this.props.selectMaster.master.id,
                label: this.props.selectMaster.master.person.name + " - " + typeMasterFormatter(this.props.selectMaster.master.type),
                master: this.props.selectMaster.master
            };
            selectMaster = this.props.selectMaster.master;
        }
        let optionProcedures = selectMaster.procedures.map(procedure => {
            return { value: procedure.id, label: procedure.description, procedure: procedure };
        });
        this.setState({
            date: this.props.event.start,
            id: this.props.event.id,
            allPrice: this.props.event.timeSlot ? this.props.event.timeSlot.allPrice : 0,
            masterWorkPrice: this.props.event.timeSlot ? this.props.event.timeSlot.masterWorkPrice : 0,
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
            clientDescription: clientDescription,
            selectClient: selectClient,
            selectClientName: selectClientName,
            selectClientPhone: selectClientPhone,
            menu:'MAIN',
            hairWeight: this.props.event.timeSlot ? this.props.event.timeSlot.hairWeight : 0,
            hairCountExtension: this.props.event.timeSlot ? this.props.event.timeSlot.hairCountExtension : 0,
            hairCountRemoval: this.props.event.timeSlot ? this.props.event.timeSlot.hairCountRemoval : 0,
            selectedHair: selectedHair,
            selectedProcedures: selectedProcedures,
            optionProcedures: optionProcedures,
            procedures: procedures
        });
    }

    refused = () => {
        this.props.close();
        this.clear();
    };

    delete = () => {
        deleteTimeSlot(this.state.id).then(() => {
            this.props.accept();
            this.clear();
        });
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
                        phone: this.state.selectClientPhone.replace(/[.*+ ?^${}()|[\]\\]/g, ""),
                    }
                }
        }

        if (!client || !this.state.selectMaster || !this.state.date || !this.state.procedures || this.state.procedures.length === 0)
            return false;

        if (this.state.procedures.some(procedure => procedure.hairType === 'HAIR_EXTENSION') && !this.state.selectedHair)
            return false;

        client.description = this.state.clientDescription;

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
            allPrice: this.state.allPrice,
            masterWorkPrice: this.state.masterWorkPrice,
            status: this.state.status,
            hairWeight: this.state.hairWeight,
            hairCountExtension: this.state.hairCountExtension,
            hairCountRemoval: this.state.hairCountRemoval,
            procedures: this.state.procedures,
            hair: this.state.selectedHair ? this.state.selectedHair.hair : undefined
        };
        createTimeSlot(timeSlot).then(resp => {
            if (resp.status === 400) {
                this.setState({
                    error: 'На складе отсутсвует введенное количество товара'
                });
                return false;
            }
            this.props.accept();
            this.clear();
        });
    };

    clear() {
        this.setState({
            selectClient: undefined,
            selectMaster: undefined,
            selectMasterName: undefined,
            selectClientName: '',
            selectClientPhone: '',
            clientDescription: '',
            submit: false,
            startHour: { value: 10, label: '10' },
            startMinutes: { value: 0, label: '00' },
            endHour: { value: 10, label: '10' },
            endMinutes: { value: 0, label: '00' },
            date: new Date(),
            allPrice: 0,
            masterWorkPrice: 0,
            status: 'NEW',
            clients:[],
            menu:'MAIN',
            selectProductByDescription: undefined,
            optionHairs: [],
            selectedHair: undefined,
            hairWeight: 0,
            hairCountExtension: 0,
            hairCountRemoval: 0,
            procedures: [],
            submitProcedure: false,
            selectedProcedures: [],
            optionProcedures: []
        });
    }

    handleInputMasterChange = (newValue) => {
        let procedures = newValue.master.procedures.map(procedure => {
            return { value: procedure.id, label: procedure.description, procedure: procedure };
        });
        this.setState({
            selectMaster: newValue.master,
            selectMasterName: {
                value: newValue.value,
                label: newValue.master.person.name + " - " + typeMasterFormatter(newValue.master.type),
                master: newValue.master
            },
            allPrice: 0,
            masterWorkPrice: 0,
            selectedProcedures: [],
            procedures: [],
            selectedHair: undefined,
            hairWeight: 0,
            hairCountExtension: 0,
            hairCountRemoval: 0,
            optionProcedures: procedures
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

    handleChangeAndRecountSum = name => event => {
        let allSum = 0, masterWorkSum = 0;
        let hairCountExtension = this.state.hairCountExtension;
        let hairCountRemoval = this.state.hairCountRemoval;
        let hairWeight = this.state.hairWeight;

        if (name==='hairCountExtension') hairCountExtension=event.target.value;
        if (name==='hairWeight') hairWeight=event.target.value;
        if (name==='hairCountRemoval') hairCountRemoval=event.target.value;

        if (this.state.selectedHair) {
            this.state.hairsCategory.filter(hairCategory => (hairCategory.masterType === this.state.selectMaster.type && hairCategory.hairType === 'HAIR_EXTENSION'))
                .forEach(hairCategory => {
                    allSum = allSum + hairCategory.price * hairCountExtension + this.state.selectedHair.hair.price * hairWeight;
                    masterWorkSum = masterWorkSum + hairCategory.price * hairCountExtension;
                });
        }
        this.state.hairsCategory.filter(hairCategory => hairCategory.hairType === 'HAIR_REMOVAL')
            .forEach(hairCategory => {
                allSum = allSum + hairCategory.price*hairCountRemoval;
                masterWorkSum = masterWorkSum + hairCategory.price*hairCountRemoval;
            });
        this.setState({
            [name]: event.target.value,
            allPrice: allSum,
            masterWorkPrice: masterWorkSum
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

    validateProcedures() {
        if (!this.state.submit)
            return false;
        return (!this.state || !this.state.procedures || this.state.procedures.length === 0);
    }

    onClientsFetchRequestedByName = ({ value }) => {
        if (value && value.length>3) getClientsByFiO(value).then(
            clients => this.changeClients(clients)
        );
    };

    onClientsFetchRequestedByPhone = ({ value }) => {
        let phone = '';
        if (value.length<2) phone = value;
        else phone = value.substring(4);
        phone = phone.replace(/[.*-+?^${}()|[\]\\\s]/g, '');
        phone = phone.substring(0, 10);
        if (phone && phone.length>3) getClientsByPhone(phone).then(
            clients => this.changeClients(clients)
        );
    };

    changeClients(clients) {
        let options = clients.map(client => {
            return {
                title: phoneFormatterToString(client.person.phone),
                clients: [
                    client
                ]
            }
        });
        this.setState({
            clients: options
        });
    }

    onClientsClearRequested = () => {
        this.setState({
            clients: []
        });
    };

    onChangeClientName = (event, { newValue }) => {
        this.setState({
            selectClientName: newValue,
            selectClient: undefined,
            clientDescription: ''
        });
    };

    onChangeClientPhone = (event, { newValue }) => {
        let phone = newValue;
        if (newValue.length === 1) phone = '+7 (' + newValue;
        else if (newValue.length === 7) phone = newValue + ") ";
        else if (newValue.length === 12) phone = newValue + " ";
        else if (newValue.length === 15) phone = newValue + " ";
        else if (newValue.length > 18) return false;
        else phone = newValue;
        this.setState({
            selectClientPhone: phone,
            selectClient: undefined,
            clientDescription: ''
        });
    };

    onClientSelected = (event, { suggestion })  => {
        this.setState({
            selectClient: suggestion,
            selectClientName: suggestion.person.name,
            clientDescription: suggestion.description ? suggestion.description : "",
            selectClientPhone: phoneFormatterToString(suggestion.person.phone)
        });
    };

    handleChangeHair = (newValue) => {
        let allSum = 0, masterWorkSum = 0;
        this.state.hairsCategory.filter(hairCategory => (hairCategory.masterType === this.state.selectMaster.type && hairCategory.hairType === 'HAIR_EXTENSION'))
            .forEach(hairCategory => {
                allSum = allSum + hairCategory.price*this.state.hairCountExtension + newValue.hair.price*this.state.hairWeight;
                masterWorkSum = masterWorkSum + hairCategory.price*this.state.hairCountExtension;
            });
        this.state.hairsCategory.filter(hairCategory => hairCategory.hairType === 'HAIR_REMOVAL')
            .forEach(hairCategory => {
                allSum = allSum + hairCategory.price*this.state.hairCountRemoval;
                masterWorkSum = masterWorkSum + hairCategory.price*this.state.hairCountRemoval;
            });

        this.setState({
            selectedHair: newValue,
            allPrice: allSum,
            masterWorkPrice: masterWorkSum
        });
    };

    handleChangeProcedures = (selectedProcedures) => {
        let allSum = 0, masterWorkSum = 0;
        let procedures = selectedProcedures.map(option => {
            return option.procedure;
        });

        let hairCountExtension = procedures.some(procedure => procedure.hairType === 'HAIR_EXTENSION') ? this.state.hairCountExtension : 0;
        let hairCountRemoval = procedures.some(procedure => procedure.hairType === 'HAIR_REMOVAL') ? this.state.hairCountRemoval : 0;
        let hairWeight = procedures.some(procedure => procedure.hairType === 'HAIR_EXTENSION') ? this.state.hairWeight : 0;
        let selectedHair = procedures.some(procedure => procedure.hairType === 'HAIR_EXTENSION') ? this.state.selectedHair : undefined;

        this.state.hairsCategory.filter(hairCategory => (hairCategory.masterType === this.state.selectMaster.type && hairCategory.hairType === 'HAIR_EXTENSION'))
            .forEach(hairCategory => {
                if (selectedHair) allSum = allSum + hairCategory.price*hairCountExtension + selectedHair.hair.price*hairWeight;
                masterWorkSum = masterWorkSum + hairCategory.price*hairCountExtension;
            });
        this.state.hairsCategory.filter(hairCategory => hairCategory.hairType === 'HAIR_REMOVAL')
            .forEach(hairCategory => {
                allSum = allSum + hairCategory.price*hairCountRemoval;
                masterWorkSum = masterWorkSum + hairCategory.price*hairCountRemoval;
            });

        this.setState({
            selectedProcedures: selectedProcedures,
            procedures: procedures,
            allPrice: allSum,
            masterWorkPrice: masterWorkSum,
            selectedHair: selectedHair,
            hairWeight: hairWeight,
            hairCountExtension: hairCountExtension,
            hairCountRemoval: hairCountRemoval
        });
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
                                    {this.state.selectClient ? <li>
                                        <a href="#" onClick={() => this.setMenu('HISTORY')}>История посещений</a>
                                    </li> : null}
                                    {this.props.event.timeSlot ? <li>
                                        <a href="#" onClick={() => this.setMenu('HISTORY_CHANGE')}>История изменений</a>
                                    </li> : null}
                                </ul>
                            </div>
                            {this.state.menu === 'HISTORY_CHANGE' ? <div className="col-sm">
                                <div className="container selectDiv">
                                    <HistoryChangeSlot changes={this.props.event.timeSlot.changes}/>
                                </div>
                            </div> : null}
                            {this.state.menu === 'HISTORY' ? <div className="col-sm">
                                <div className="container selectDiv">
                                    <HistoryClients client={this.state.selectClient}/>
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
                                                    options={hourOptions()}
                                                    placeholder={''}
                                                    onChange={this.handleChangeStartHour}
                                                    className='selectStyle'
                                                />
                                                <div className="quote">:</div>
                                                <Select
                                                    value={this.state.startMinutes}
                                                    options={minuteOptions()}
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
                                                    options={hourOptions()}
                                                    placeholder={''}
                                                    onChange={this.handleChangeEndHour}
                                                    className='selectStyle'
                                                />
                                                <div className="quote">:</div>
                                                <Select
                                                    value={this.state.endMinutes}
                                                    options={minuteOptions()}
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
                                        Комментарии к клиенту:
                                    </div>
                                </div>
                                <div>
                                    <TextField InputLabelProps={{ shrink: true }} value={this.state.clientDescription}
                                               onChange={this.handleChange('clientDescription')} fullWidth/>
                                </div>
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
                                            <FormControl className={classes.formControl} error={this.validateProcedures()} aria-describedby="procedures-error-text">
                                                <Select id="procedures"
                                                        isMulti
                                                        closeMenuOnSelect={false}
                                                        value={this.state.selectedProcedures}
                                                        onChange={this.handleChangeProcedures}
                                                        placeholder="Выберите услуги"
                                                        options={this.state.optionProcedures}
                                                />
                                                { this.validateProcedures() ? <FormHelperText id="procedures-error-text">Необходимо выбрать хотя бы один вариант</FormHelperText>: null }
                                            </FormControl>
                                        </div>
                                    </div>
                                </div>
                                <hr/>
                                {this.state.procedures.some(procedure => procedure.hairType === 'HAIR_EXTENSION' || procedure.hairType === 'HAIR_CORRECTION') ? <div className="container">
                                    <div className="row">
                                        <div className="col-sm-2 title-margin">
                                            Расход волос:
                                        </div>
                                        <div className="col-sm">
                                            <Select value={this.state.selectedHair}
                                                    onChange={this.handleChangeHair}
                                                    placeholder="Выберите категорию волос"
                                                    options={this.state.optionHairs}
                                            />
                                            { this.state.error ? <div className="row error_label error_label_slot">
                                                {this.state.error}
                                            </div> : null}
                                            <FormControl className={classes.formControlHairs} error={this.validate('selectedHair')} aria-describedby="selectedHair-error-text">
                                                { this.validate('selectedHair') ? <FormHelperText id="selectedHair-error-text">Поле не может быть пустым</FormHelperText>: null }
                                            </FormControl>
                                        </div>
                                    </div>
                                    {this.state.selectedHair ? <div className="row">
                                        <div className="col-sm-3 title-margin-date">
                                            Количество (шт.):
                                        </div>
                                        <div className="col-sm">
                                            <TextField
                                                className={classes.formControl}
                                                value={this.state.hairCountExtension}
                                                onChange={this.handleChangeAndRecountSum('hairCountExtension')}
                                                InputProps={{
                                                    inputComponent: NumberFormatCustom,
                                                }}
                                            />
                                        </div>
                                        <div className="col-sm-3 title-margin-date">
                                            Вес (гр.):
                                        </div>
                                        <div className="col-sm">
                                            <TextField
                                                className={classes.formControl}
                                                value={this.state.hairWeight}
                                                onChange={this.handleChangeAndRecountSum('hairWeight')}
                                                InputProps={{
                                                    inputComponent: NumberFormatCustom,
                                                }}
                                            />
                                        </div>
                                    </div> : null}
                                    <hr/>
                                </div> : null}
                                {this.state.procedures.some(procedure => procedure.hairType === 'HAIR_REMOVAL' || procedure.hairType === 'HAIR_CORRECTION') ? <div className="container">
                                    <div className="row">
                                        <div className="col-sm-4 title-margin-date">
                                            Снятие волос (количество прядей):
                                        </div>
                                        <div className="col-sm-3">
                                            <TextField
                                                className={classes.formControl}
                                                value={this.state.hairCountRemoval}
                                                onChange={this.handleChangeAndRecountSum('hairCountRemoval')}
                                                InputProps={{
                                                    inputComponent: NumberFormatCustom,
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <hr/>
                                </div> : null}
                                <div className="container">
                                    <div className="row">
                                        <div className="col-sm-3 title-margin-date">
                                            Услуги мастера (руб.):
                                        </div>
                                        <div className="col-sm">
                                            <TextField
                                                className={classes.formControl}
                                                value={this.state.masterWorkPrice}
                                                onChange={this.handleChange('masterWorkPrice')}
                                                InputProps={{
                                                    inputComponent: NumberFormatCustom,
                                                }}
                                            />
                                        </div>
                                        <div className="col-sm-3 title-margin-date">
                                            Общая стоимость (руб.):
                                        </div>
                                        <div className="col-sm">
                                            <TextField
                                                className={classes.formControl}
                                                value={this.state.allPrice}
                                                onChange={this.handleChange('allPrice')}
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
                        {this.state.id ? <button className="btn btn-primary" onClick={this.delete}>
                            Удалить
                        </button> : null}
                    </div>
                </Modal>
            </div>
        );
    }
}

export default withStyles(styles)(TimeSlotModal);
