import React, {Component} from 'react';
import '../App.css';
import Modal from 'react-responsive-modal';
import {withStyles} from '@material-ui/core/styles';
import AsyncPaginate from 'react-select-async-paginate';
import {getClientsByFiO, getClientsByPhone} from "../service/clientService";
import {getMasters, getMastersByFiO} from "../service/masterService";
import PageParams from "../model/PageParams";

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
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        marginTop: 16,
        width: 200
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

    refused = () => {
        this.props.close();
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
    };

    accept = () => {
        let timeSlot = {
            client: this.state.selectClient,
            master: this.state.selectMaster,
            startSlot: this.props.start,
            endSlot: this.props.end,
            price: 400
        };
        this.props.accept(timeSlot);

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
    };

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

    render() {
        return (
            <div>
                <Modal open={this.props.open}
                       closeOnOverlayClick={false}
                       showCloseIcon={false}
                       onClose={this.refused}
                       closeOnEsc={false} center={false}>
                    { this.props.start ? <div>

                        <div className="container">
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
                                <div className="col-sm">
                                    Время начала:
                                </div>
                                <div className="col-sm">
                                    {this.props.start.toLocaleTimeString()}
                                </div>
                                <div className="col-sm">
                                    Время завершения:
                                </div>
                                <div className="col-sm">
                                    {this.props.end.toLocaleTimeString()}
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
                        />
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
                        />
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
                        />
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
