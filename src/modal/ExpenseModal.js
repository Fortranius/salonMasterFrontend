import React, {Component} from 'react';
import '../App.css';
import Modal from 'react-responsive-modal';
import {withStyles} from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import AsyncPaginate from 'react-select-async-paginate';
import {getProducts, getProductsByDescription} from "../service/productService";
import {getMasters, getMastersByFiO} from "../service/masterService";
import PageParams from "../model/PageParams";
import TextField from '@material-ui/core/TextField';
import MomentLocaleUtils, {formatDate, parseDate,} from 'react-day-picker/moment';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import moment from "moment/moment";
import NumberFormat from 'react-number-format';

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

class ExpenseModal extends Component {

    constructor() {
        super();
        this.state = {
            id: undefined,
            date: new Date(),
            selectProduct: undefined,
            selectMaster: undefined,
            selectProductByDescription: undefined,
            selectMasterFio: undefined,
            countProduct: 1,
            submit: false
        };
        this.refused = this.refused.bind(this);
        this.accept = this.accept.bind(this);
        this.handleInputProductChange = this.handleInputProductChange.bind(this);
        this.handleInputMasterChange = this.handleInputMasterChange.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeCountProduct = this.handleChangeCountProduct.bind(this);
        this.handleChangeDate = this.handleChangeDate.bind(this);
    }

    componentDidMount() {
        if (this.props.update) {
            this.setState({
                id: this.props.update.id,
                date: this.props.update.date ? moment.unix(this.props.update.date).toDate() : new Date(),
                countProduct: this.props.update.countProduct,
                selectProduct: this.props.update.product,
                selectMaster: this.props.update.master,
                cost: this.props.update.cost,
                selectMasterFio: {
                    value: this.props.update.master.id,
                    label: this.props.update.master.person.name,
                    master: this.props.update.master
                },
                selectProductByDescription: {
                    value: this.props.update.product.id,
                    label: this.props.update.product.description,
                    product: this.props.update.product
                }
            });
        }
    }

    clear() {
        this.setState({
            id: undefined,
            date: new Date(),
            selectProduct: undefined,
            selectMaster: undefined,
            selectProductByDescription: undefined,
            selectMasterFio: undefined,
            countProduct: 1,
            cost: '',
            submit: false
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
        if (this.state.selectProduct
            && this.state.countProduct>0
            && this.state.selectMaster
            && this.state.date) {
            let expense = {
                id: this.state.id,
                date: this.state.date,
                product: this.state.selectProduct,
                master: this.state.selectMaster,
                cost: this.state.cost,
                countProduct: this.state.countProduct
            };
            this.props.accept(expense);
            this.clear();
        }
    };

    handleInputProductChange = (newValue) => {
        this.setState({
            selectProduct: newValue.product,
            selectProductByDescription: {
                value: newValue.value,
                label: newValue.product.description,
                product: newValue.product
            }
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

    handleChangeCountProduct = event => {
        if (event.target.value > 0) {
            this.setState({
                countProduct: event.target.value
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
                                Товар:
                            </div>
                            <div className="col-sm-4">
                                <AsyncPaginate
                                    value={this.state.selectProductByDescription}
                                    loadOptions={getOptionExpensesByDescription}
                                    onChange={this.handleInputProductChange}
                                    placeholder={'Выберите товар'}
                                />
                                <FormControl className={classes.formControl} error={this.validate('selectProduct')} aria-describedby="selectProduct-error-text">
                                    { this.validate('selectProduct') ? <FormHelperText id="selectProduct-error-text">Поле не может быть пустым</FormHelperText>: null }
                                </FormControl>
                            </div>
                            <div className="col-sm-2">
                                Количество:
                            </div>
                            <div className="col-sm-4">
                                <TextField InputLabelProps={{ shrink: true }} value={this.state.countProduct}
                                           onChange={this.handleChangeCountProduct} type="number"/>

                                <FormControl className={classes.formControl} error={this.validate('countProduct')} aria-describedby="countProduct-error-text">
                                    { this.validate('countProduct') ? <FormHelperText id="countProduct-error-text">Поле не может быть пустым</FormHelperText>: null }
                                </FormControl>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-2">
                                Мастер:
                            </div>
                            <div className="col-sm">
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
                                    { this.validate('date') ? <FormHelperText id="selectMaster-error-text">Поле не может быть пустым</FormHelperText>: null }
                                </FormControl>
                            </div>
                        </div>
                    </div>
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

export default withStyles(styles)(ExpenseModal);
