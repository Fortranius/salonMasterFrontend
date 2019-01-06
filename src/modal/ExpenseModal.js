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
        label: d.person.name + " " + d.person.surname + " " + d.person.patronymic,
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
    console.log(cachedOptions);
    return {
        options: cachedOptions,
        hasMore: true
    };
}

class ExpenseModal extends Component {

    constructor() {
        super();
        this.state = {
            id: undefined,
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
    }

    componentDidMount() {
        if (this.props.update) {
            this.setState({
                id: this.props.update.id,
                countProduct: this.props.update.countProduct,
                selectProduct: this.props.update.product,
                selectMaster: this.props.update.master,
                selectMasterFio: {
                    value: this.props.update.master.id,
                    label: this.props.update.master.person.name
                    + " " + this.props.update.master.person.surname
                    + " " + this.props.update.master.person.patronymic,
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
            selectProduct: undefined,
            selectMaster: undefined,
            selectProductByDescription: undefined,
            selectMasterFio: undefined,
            countProduct: 1,
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
            && this.state.selectMaster) {
            let expense = {
                id: this.state.id,
                product: this.state.selectProduct,
                master: this.state.selectMaster,
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
                label: newValue.master.person.name + " " + newValue.master.person.surname + " " + newValue.master.person.patronymic,
                master: newValue.master
            }
        });
    };

    handleChange = event => {
        if (event.target.value > 0) {
            this.setState({
                countProduct: event.target.value
            });
        }
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
                                           onChange={this.handleChange} type="number"/>

                                <FormControl className={classes.formControl} error={this.validate('selectProduct')} aria-describedby="selectProduct-error-text">
                                    { this.validate('selectProduct') ? <FormHelperText id="selectProduct-error-text">Поле не может быть пустым</FormHelperText>: null }
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
