import React, {Component} from 'react';
import '../App.css';
import BootstrapTable from 'react-bootstrap-table-next';
import colProduct from "../data/colProduct";
import ProductModal from "../modal/ProductModal";
import {createProduct, getProducts, updateProduct} from "../service/productService";

class Products extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            openCreate: false,
            openUpdate: false
        };
        this.createProduct = this.createProduct.bind(this);
        this.updateProduct = this.updateProduct.bind(this);
        this.onCloseCreateModal = this.onCloseCreateModal.bind(this);
        this.onOpenCreateModal = this.onOpenCreateModal.bind(this);
        this.onCloseUpdateModal = this.onCloseUpdateModal.bind(this);
        this.onOpenUpdateModal = this.onOpenUpdateModal.bind(this);
        this.handleOnSelect = this.handleOnSelect.bind(this);
        getProducts().then(data => {
            this.setState({
                data: data
            });
        });
    }

    createProduct(entity) {
        createProduct(entity).then(() => {
            getProducts().then(data => {
                this.setState({
                    openCreate: false,
                    data: data
                });
            });
        });
    };

    updateProduct(entity) {
        updateProduct(entity).then(() => {
            getProducts().then(data => {
                this.setState({
                    openUpdate: false,
                    data: data,
                    select: entity
                });
            });
        });
    };

    onCloseCreateModal = () => {
        this.setState({
            openCreate: false
        });
    };

    onOpenCreateModal () {
        this.setState({
            openCreate: true
        });
    };

    onCloseUpdateModal = () => {
        this.setState({
            openUpdate: false
        });
    };

    onOpenUpdateModal () {
        this.setState({
            openUpdate: true
        });
    };

    handleOnSelect = (row) => {
        this.setState({
            select : row
        });
    };

    render() {
        const selectRow = {
            mode: 'radio',
            clickToSelect: true,
            hideSelectColumn: true,
            bgColor: '#00BFFF',
            onSelect: this.handleOnSelect,
        };
        return (
            <div>
                <div className="button-group">
                    <button onClick = { this.onOpenCreateModal } className="btn btn-primary">
                        Добавить товар
                    </button>
                    { this.state.select ? <button onClick = { this.onOpenUpdateModal } className="btn btn-primary">
                        Изменить товар
                    </button> : null }
                </div>
                {this.state.data ? <BootstrapTable
                    keyField="id"
                    selectRow={ selectRow }
                    data={this.state.data}
                    columns={colProduct}
                />: null}
                <ProductModal accept={this.createProduct}
                              open={this.state.openCreate}
                              close={this.onCloseCreateModal} />
                {this.state.openUpdate ? <ProductModal accept={this.updateProduct}
                              open={this.state.openUpdate}
                              select={this.state.select}
                              close={this.onCloseUpdateModal} /> : null }
            </div>
        );
    }
}

export default Products;
