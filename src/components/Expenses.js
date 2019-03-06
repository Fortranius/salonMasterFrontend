import React, {Component} from 'react';
import '../App.css';
import TableRemote from "./remote/TableRemote";
import {connect} from 'react-redux';
import {getExpensesAction} from "../actions/expenseActions"
import {bindActionCreators} from 'redux'
import PageParams from '../model/PageParams'
import ExpenseModal from "../modal/ExpenseModal";
import {getAllMasters} from "../service/masterService";
import {selectFilter} from "react-bootstrap-table2-filter";
import {getProducts} from "../service/productService";
import moment from 'moment'

class Expenses extends Component {

    constructor(props) {
        super(props);
        this.state = {
            openUpdate: false,
            openCreate: false,
            sortField: '',
            sortOrder: '',
            masterOptions: {},
            productOptions: {},
            filters: {},
            row: undefined,
            error: undefined
        };
        this.handleTableChange = this.handleTableChange.bind(this);

        this.onOpenUpdateModal = this.onOpenUpdateModal.bind(this);
        this.onCloseUpdateModal = this.onCloseUpdateModal.bind(this);

        this.onOpenCreateModal = this.onOpenCreateModal.bind(this);
        this.onCloseCreateModal = this.onCloseCreateModal.bind(this);

        this.accept = this.accept.bind(this);

        this.props.expenseActions(new PageParams(0, 10));

        getAllMasters().then(masters => {
            let masterOptions = {};
            masters.forEach(master => {
                masterOptions[master.id] = master.person.name;
            });
            this.setState({
                masterOptions: masterOptions
            })
        });
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
            row: row,
            error: undefined
        });
    };

    onOpenCreateModal () {
        this.setState({
            openCreate: true,
            error: undefined
        });
    };

    onCloseUpdateModal = () => {
        this.setState({
            openUpdate: false,
            row: undefined,
            error: undefined
        });
    };

    onCloseCreateModal = () => {
        this.setState({
            openCreate: false,
            error: undefined
        });
    };

    handleTableChange = (type, {sortField, sortOrder, filters, page, sizePerPage}) => {
        this.setState({
            sortField: sortField,
            sortOrder: sortOrder,
            filters: filters
        });
        this.props.expenseActions(new PageParams(page - 1, sizePerPage, sortField, sortOrder, filters));
    };

    accept() {
        this.props.expenseActions(new PageParams(
            this.props.expenses.number,
            this.props.expenses.size,
            this.state.sortField,
            this.state.sortOrder,
            this.state.filters
        ));
        this.setState({
            openUpdate: false,
            openCreate: false,
            row: undefined,
            error: undefined
        });
    };

    render() {
        const colExpense = [
            {
                dataField: 'date',
                text: 'Дата расхода',
                sort: true,
                formatter: (cellContent) => {
                    return (
                        <div>
                            {moment.unix(cellContent).format("DD.MM.YYYY")}
                        </div>
                    )
                }
            },{
                dataField: 'master.person.name',
                text: '',
                sort: true,
                filter: selectFilter({
                    placeholder: 'Мастер',
                    style: {
                        backgroundColor: '#e4e4e1'
                    },
                    options: this.state.masterOptions
                })
            },
            {
                dataField: 'product.description',
                text: '',
                sort: true,
                filter: selectFilter({
                    placeholder: 'Товар',
                    style: {
                        backgroundColor: '#e4e4e1'
                    },
                    options: this.state.productOptions
                })
            },
            {
                dataField: 'countProduct',
                text: 'Количество товара'
            }
        ];
        return (
            <div className="main-div">
                <TableRemote data={this.props.expenses ? this.props.expenses.content : []}
                                                   page={this.props.expenses ? this.props.expenses.number + 1 : 1}
                                                   columns={colExpense}
                                                   entity="расход"
                                                   buttonCreateTitle='Создание нового расхода'
                                                   buttonEditTitle='Изменение расхода'
                                                   sizePerPage={this.props.expenses ? this.props.expenses.size : 0}
                                                   update={this.onOpenUpdateModal}
                                                   create={this.onOpenCreateModal}
                                                   totalSize={this.props.expenses ? this.props.expenses.totalElements : 0}
                                                   onTableChange={this.handleTableChange}/>

                {this.state.row ? <ExpenseModal accept={this.accept}
                             open={this.state.openUpdate}
                             isCreate={false}
                             update={this.state.row}
                             close={this.onCloseUpdateModal} />: null}

                <ExpenseModal accept={this.accept}
                             open={this.state.openCreate} isCreate={true}
                             close={this.onCloseCreateModal} />
            </div>
        );
    }
}

const mapStateToProps = state => ({
    expenses: state.expenseReducer.expenses
});

function mapDispatchToProps(dispatch) {
    return {
        expenseActions: bindActionCreators(getExpensesAction, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Expenses);
