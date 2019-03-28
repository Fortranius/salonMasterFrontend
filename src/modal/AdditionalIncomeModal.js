import React, {Component} from 'react';
import '../App.css';
import Modal from 'react-responsive-modal';
import {withStyles} from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import AsyncPaginate from 'react-select-async-paginate';
import {getMasters, getMastersByFiO} from "../service/masterService";
import PageParams from "../model/PageParams";
import TextField from '@material-ui/core/TextField';
import MomentLocaleUtils, {formatDate, parseDate,} from 'react-day-picker/moment';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import moment from "moment/moment";
import {createAdditionalIncome, updateAdditionalIncome} from "../service/additionalIncomeService";

const styles = theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    formControl: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        marginTop:16,
        width: 400
    }
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

class AdditionalIncomeModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: undefined,
            date: new Date(),
            selectProduct: undefined,
            selectMaster: undefined,
            selectMasterFio: undefined,
            sum: 0,
            submit: false,
            error: undefined
        };
        this.refused = this.refused.bind(this);
        this.accept = this.accept.bind(this);
        this.handleInputMasterChange = this.handleInputMasterChange.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeSum = this.handleChangeSum.bind(this);
        this.handleChangeDate = this.handleChangeDate.bind(this);
    }

    componentDidMount() {
        if (this.props.update) {
            this.setState({
                id: this.props.update.id,
                date: this.props.update.date ? moment.unix(this.props.update.date).toDate() : new Date(),
                sum: this.props.update.sum,
                selectMaster: this.props.update.master,
                selectMasterFio: {
                    value: this.props.update.master.id,
                    label: this.props.update.master.person.name,
                    master: this.props.update.master
                },
                error: undefined
            });
        }
    }

    clear() {
        this.setState({
            id: undefined,
            date: new Date(),
            selectMaster: undefined,
            selectMasterFio: undefined,
            sum: 0,
            submit: false,
            error: undefined
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
        if (this.state.sum>0
            && this.state.selectMaster
            && this.state.date) {
            let additionalIncome = {
                id: this.state.id,
                date: this.state.date,
                master: this.state.selectMaster,
                sum: this.state.sum
            };
            if (this.props.isCreate) this.createAdditionalIncome(additionalIncome);
            else this.updateAdditionalIncome(additionalIncome);
        }
    };

    updateAdditionalIncome(entity) {
        updateAdditionalIncome(entity).then(resp => {
            this.props.accept();
            this.clear();
        });
    };

    createAdditionalIncome(entity) {
        createAdditionalIncome(entity).then(resp => {
            this.props.accept();
            this.clear();
        });
    };

    handleInputMasterChange = (newValue) => {
        this.setState({
            selectMaster: newValue.master,
            selectMasterFio: {
                value: newValue.value,
                label: newValue.master.person.name,
                master: newValue.master
            }
        });
    };

    handleChangeSum = event => {
        if (event.target.value > 0) {
            this.setState({
                sum: event.target.value,
                error: undefined
            });
        }
    };

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value
        });
    };

    handleChangeDate = (newValue) => {
        this.setState({
            date: newValue
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
                    <div className="container">
                        <div className="row">
                            <div className="col-sm-2">
                                Мастер:
                            </div>
                            <div className="col-sm-4">
                                <AsyncPaginate
                                    value={this.state.selectMasterFio}
                                    loadOptions={getOptionMastersByFIO}
                                    onChange={this.handleInputMasterChange}
                                    placeholder={'Выберите мастера'}
                                />
                                <FormControl className={classes.formControl} error={this.validate('selectMaster')} aria-describedby="selectMaster-error-text">
                                    { this.validate('selectMaster') ? <FormHelperText id="selectMaster-error-text">Поле не может быть пустым</FormHelperText>: null }
                                </FormControl>
                            </div>
                            <div className="col-sm-2">
                                Сумма:
                            </div>
                            <div className="col-sm-4">
                                <TextField InputLabelProps={{ shrink: true }} value={this.state.sum}
                                           onChange={this.handleChangeSum} type="number"/>

                                <FormControl className={classes.formControl} error={this.validate('countProduct')} aria-describedby="countProduct-error-text">
                                    { this.validate('countProduct') ? <FormHelperText id="countProduct-error-text">Поле не может быть пустым</FormHelperText>: null }
                                </FormControl>
                            </div>
                        </div>
                        <div className="row">
                        <div className="col-sm-2">
                            Дата:
                        </div>
                        <div className="col-sm-4">
                            <DayPickerInput
                                placeholder={`Дата расхода`}
                                parseDate={parseDate}
                                value={this.state.date}
                                onDayChange={this.handleChangeDate}
                                formatDate={formatDate}
                                dayPickerProps={{
                                    locale: 'ru',
                                    localeUtils: MomentLocaleUtils,
                                }}/>
                            <FormControl className={classes.formControl} error={this.validate('date')} aria-describedby="date-error-text">
                                { this.validate('date') ? <FormHelperText id="date-error-text">Поле не может быть пустым</FormHelperText>: null }
                            </FormControl>
                        </div>
                    </div>
                    </div>
                    { this.state.error ? <div className="row error_label">
                        {this.state.error}
                    </div> : null}
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

export default withStyles(styles)(AdditionalIncomeModal);
