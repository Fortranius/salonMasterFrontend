import React, {Component} from 'react';
import '../App.css';
import Modal from 'react-responsive-modal';
import {withStyles} from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import AsyncPaginate from 'react-select-async-paginate';
import {getProducts, getProductsByDescription} from "../service/productService";
import TextField from '@material-ui/core/TextField';
import MomentLocaleUtils, {formatDate, parseDate,} from 'react-day-picker/moment';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import moment from "moment/moment";
import {createIncoming, updateIncoming} from "../service/incomingService";

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

async function getOptionIncomingByDescription(search, loadedOptions) {
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

class IncomingModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: undefined,
            date: new Date(),
            selectProduct: undefined,
            selectProductByDescription: undefined,
            countProduct: 1,
            submit: false,
            error: undefined
        };
        this.refused = this.refused.bind(this);
        this.accept = this.accept.bind(this);
        this.handleInputProductChange = this.handleInputProductChange.bind(this);
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
                selectProductByDescription: {
                    value: this.props.update.product.id,
                    label: this.props.update.product.description,
                    product: this.props.update.product
                },
                error: undefined
            });
        }
    }

    clear() {
        this.setState({
            id: undefined,
            date: new Date(),
            selectProduct: undefined,
            selectProductByDescription: undefined,
            countProduct: 1,
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
        if (this.state.selectProduct
            && this.state.countProduct>0
            && this.state.date) {
            let incoming = {
                id: this.state.id,
                date: this.state.date,
                product: this.state.selectProduct,
                countProduct: this.state.countProduct
            };
            if (this.props.isCreate) this.createIncoming(incoming);
            else this.updateIncoming(incoming);
        }
    };

    updateIncoming(entity) {
        updateIncoming(entity).then(resp => {
            this.props.accept();
            this.clear();
        });
    };

    createIncoming(entity) {
        createIncoming(entity).then(resp => {
            this.props.accept();
            this.clear();
        });
    };

    handleInputProductChange = (newValue) => {
        this.setState({
            selectProduct: newValue.product,
            selectProductByDescription: {
                value: newValue.value,
                label: newValue.product.description,
                product: newValue.product
            },
            error: undefined
        });
    };

    handleChangeCountProduct = event => {
        if (event.target.value > 0) {
            this.setState({
                countProduct: event.target.value,
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
                                Товар:
                            </div>
                            <div className="col-sm-4">
                                <AsyncPaginate
                                    value={this.state.selectProductByDescription}
                                    loadOptions={getOptionIncomingByDescription}
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
                            Дата:
                        </div>
                        <div className="col-sm-4">
                            <DayPickerInput
                                placeholder={`Дата прихода`}
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

export default withStyles(styles)(IncomingModal);
