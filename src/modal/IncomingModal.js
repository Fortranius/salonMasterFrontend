import React, {Component} from 'react';
import '../App.css';
import Modal from 'react-responsive-modal';
import {withStyles} from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import AsyncPaginate from 'react-select-async-paginate';
import {getProducts, getProductsByDescription} from "../service/productService";
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

class IncomingModal extends Component {

    constructor() {
        super();
        this.state = {
            id: undefined,
            selectProduct: undefined,
            selectProductByDescription: undefined,
            countProduct: 1,
            submit: false
        };
        this.refused = this.refused.bind(this);
        this.accept = this.accept.bind(this);
        this.handleInputProductChange = this.handleInputProductChange.bind(this);
        this.handleChangeCountProduct = this.handleChangeCountProduct.bind(this);
    }

    clear() {
        this.setState({
            id: undefined,
            date: new Date(),
            selectProduct: undefined,
            selectProductByDescription: undefined,
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
            && this.state.countProduct>0) {
            let incoming = {
                id: this.state.id,
                product: this.state.selectProduct,
                countProduct: this.state.countProduct
            };
            this.props.accept(incoming);
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

    handleChangeCountProduct = event => {
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
                            <div className="col-sm-2 title-margin">
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
                            <div className="col-sm-2 title-margin">
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

export default withStyles(styles)(IncomingModal);
