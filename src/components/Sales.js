import React, {Component} from 'react';
import '../App.css';
import TableRemote from "./remote/TableRemote";
import {connect} from 'react-redux';
import {getSalesAction} from "../actions/saleActions"
import {bindActionCreators} from 'redux'
import PageParams from '../model/PageParams'
import {getProducts} from "../service/productService";
import moment from 'moment'
import SaleModal from "../modal/SaleModal";
import {createSale, updateSale} from "../service/saleService";

class Sales extends Component {

    constructor(props) {
        super(props);
        this.state = {
            openUpdate: false,
            openCreate: false,
            productOptions: {},
            row: undefined
        };
        this.handleTableChange = this.handleTableChange.bind(this);

        this.updateSale = this.updateSale.bind(this);
        this.onOpenUpdateModal = this.onOpenUpdateModal.bind(this);
        this.onCloseUpdateModal = this.onCloseUpdateModal.bind(this);

        this.createSale = this.createSale.bind(this);
        this.onOpenCreateModal = this.onOpenCreateModal.bind(this);
        this.onCloseCreateModal = this.onCloseCreateModal.bind(this);

        this.props.saleActions(new PageParams(0, 10));

        getProducts().then(products => {
            let productOptions = {};
            products.forEach(product => {
                productOptions[product.id] = product.description;
            });
            this.setState({
                productOptions: productOptions
            })
        });
    }

    onOpenUpdateModal (row) {
        this.setState({
            openUpdate: true,
            row: row
        });
    };

    onOpenCreateModal () {
        this.setState({
            openCreate: true,
        });
    };

    onCloseUpdateModal = () => {
        this.setState({
            openUpdate: false,
            row: undefined
        });
    };

    onCloseCreateModal = () => {
        this.setState({
            openCreate: false
        });
    };

    handleTableChange = (type, {sortField, sortOrder, filters, page, sizePerPage}) => {
        this.props.saleActions(new PageParams(page - 1, sizePerPage, sortField, sortOrder, filters));
    };

    updateSale(entity) {
        updateSale(entity).then(() => {
            this.props.saleActions(new PageParams(
                this.props.sales.number,
                this.props.sales.size
            ));
            this.setState({
                openUpdate: false,
                row: undefined
            });
        });
    };

    createSale(entity) {
        createSale(entity).then(() => {
            this.props.saleActions(new PageParams(
                this.props.sales.number,
                this.props.sales.size
            ));
            this.setState({
                openCreate: false
            });
        });
    };

    render() {
        const colSale = [
            {
                dataField: 'date',
                text: 'Дата продажи',
                formatter: (cellContent) => {
                    return (
                        <div>
                            {moment.unix(cellContent).format("DD.MM.YYYY")}
                        </div>
                    )
                }
            },
            {
                dataField: 'product.description',
                text: 'Товар'
            },
            {
                dataField: 'countProduct',
                text: 'Количество товара'
            }
        ];
        return (
            <div className="main-div">
                <TableRemote data={this.props.sales ? this.props.sales.content : []}
                                                   page={this.props.sales ? this.props.sales.number + 1 : 1}
                                                   columns={colSale}
                                                   entity="продажа"
                                                   buttonCreateTitle='Создание новой продажи'
                                                   buttonEditTitle='Изменение продажи'
                                                   sizePerPage={this.props.sales ? this.props.sales.size : 0}
                                                   update={this.onOpenUpdateModal}
                                                   create={this.onOpenCreateModal}
                                                   totalSize={this.props.sales ? this.props.sales.totalElements : 0}
                                                   onTableChange={this.handleTableChange}/>

                {this.state.row ? <SaleModal accept={this.updateSale}
                             open={this.state.openUpdate}
                             update={this.state.row}
                             close={this.onCloseUpdateModal} />: null}

                <SaleModal accept={this.createSale}
                             open={this.state.openCreate}
                             close={this.onCloseCreateModal} />
            </div>
        );
    }
}

const mapStateToProps = state => ({
    sales: state.saleReducer.sales
});

function mapDispatchToProps(dispatch) {
    return {
        saleActions: bindActionCreators(getSalesAction, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Sales);
