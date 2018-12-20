import React, {Component} from 'react';
import '../App.css';
import Modal from 'react-responsive-modal';
import {withStyles} from '@material-ui/core/styles';
import AsyncPaginate from 'react-select-async-paginate';
import {getClientsByFiO, getClientsByPhone} from "../service/clientService";
import {getMasters, getMastersByFiO} from "../service/masterService";
import PageParams from "../model/PageParams";
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from 'react-select';
import moment from "moment/moment";
import hoursOptions from '../data/hoursOptions'
import minutesOptions from '../data/minutesOptions'

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
        hasMore: true,
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
        hasMore: true,
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
        hasMore: true,
    };
}

class TimeSlotModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectClient: undefined,
            selectMaster: undefined,
            selectMasterFio: undefined,
            selectClientFio: undefined,
            selectClientPhone: undefined,
            timeSlot: {
                selectClient: undefined,
                selectMaster: undefined,
            }
        };
        this.refused = this.refused.bind(this);
        this.accept = this.accept.bind(this);
        this.handleInputClientChange = this.handleInputClientChange.bind(this);
        this.handleInputMasterChange = this.handleInputMasterChange.bind(this);
    }

    componentDidMount() {
        let start = moment.unix(this.props.start).toDate();
        let end = moment.unix(this.props.end).toDate();
        this.setState({
            startHour: start.getHours(),
            startMinutes: start.getMinutes(),
            endHour: end.getHours(),
            endMinutes: end.getMinutes()
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
        let timeSlot = {
            client: this.state.selectClient,
            master: this.state.selectMaster,
            startSlot: this.state.startSlot,
            endSlot: this.state.endSlot,
            price: 400
        };

        if (!this.state.selectClient || !this.state.selectMaster)
            return false;

        this.props.accept(timeSlot);
        this.clear();
    };

    clear() {
        this.setState({
            selectClient: undefined,
            selectMaster: undefined,
            selectMasterFio: undefined,
            selectClientFio: undefined,
            selectClientPhone: undefined,
            timeSlot: {
                selectClient: undefined,
                selectMaster: undefined,
            }
        });
    }

    handleInputClientChange = (newValue) => {
        this.setState({
            selectClient: newValue.client,
            selectClientFio: {
                value: newValue.value.id,
                label: newValue.client.person.name + " " + newValue.client.person.surname + " " + newValue.client.person.patronymic,
                client: newValue.client
            },
            selectClientPhone: {
                value: newValue.value.id,
                label: newValue.client.person.phone,
                client: newValue.client
            }
        });
    };

    handleInputMasterChange = (newValue) => {
        this.setState({
            selectMaster: newValue.master,
            selectMasterFio: {
                value: newValue.value.id,
                label: newValue.master.person.name + " " + newValue.master.person.surname + " " + newValue.master.person.patronymic,
                master: newValue.master
            }
        });
    };

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
                    { this.props.start ? <div>
                        <div className="container selectDiv">
                            <div className="row">
                                <div className="col-sm">
                                    Дата заказа:
                                </div>
                                <div className="col-sm">
                                    {this.props.start.toLocaleDateString()}
                                </div>
                            </div>
                            <hr/>
                            <div className="row">
                                <div className="col-sm-2">
                                    Время начала:
                                </div>
                                <div className="col-sm">
                                    <div className="inlineDiv">
                                        <Select
                                            value={this.state.startHour}
                                            options={hoursOptions}
                                            placeholder={''}
                                            className='selectStyle'
                                        />
                                        <div className="quote">:</div>
                                        <Select
                                            value={this.state.startMinutes}
                                            options={minutesOptions}
                                            placeholder={''}
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
                                            className='selectStyle'
                                        />
                                        <div className="quote">:</div>
                                        <Select
                                            value={this.state.endMinutes}
                                            options={minutesOptions}
                                            placeholder={''}
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
                                <div className="col-sm">
                                    Цена:
                                </div>
                                <div className="col-sm">
                                    {this.props.start.toLocaleTimeString()}
                                </div>
                                <div className="col-sm">
                                    Услуга:
                                </div>
                                <div className="col-sm">
                                    {this.props.end.toLocaleTimeString()}
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
