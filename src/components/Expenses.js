import React, {Component} from 'react';
import '../App.css';
import TableRemote from "./remote/TableRemote";
import colExpense from "../data/colExpense";
import {connect} from 'react-redux';
import {getExpensesAction} from "../actions/expenseActions"
import {bindActionCreators} from 'redux'
import PageParams from '../model/PageParams'
import {createExpense, updateExpense} from "../service/expenseService";
import ExpenseModal from "../modal/ExpenseModal";

class Expenses extends Component {

    constructor(props) {
        super(props);
        this.state = {
            openUpdate: false,
            openCreate: false,
            row: undefined
        };
        this.handleTableChange = this.handleTableChange.bind(this);

        this.updateExpense = this.updateExpense.bind(this);
        this.onOpenUpdateModal = this.onOpenUpdateModal.bind(this);
        this.onCloseUpdateModal = this.onCloseUpdateModal.bind(this);

        this.createExpense = this.createExpense.bind(this);
        this.onOpenCreateModal = this.onOpenCreateModal.bind(this);
        this.onCloseCreateModal = this.onCloseCreateModal.bind(this);

        this.props.expenseActions(new PageParams(0, 10));
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

    handleTableChange = (type, {page, sizePerPage}) => {
        this.props.expenseActions(new PageParams(page - 1, sizePerPage));
    };

    updateExpense(entity) {
        updateExpense(entity).then(() => {
            this.props.expenseActions(new PageParams(this.props.expenses.number, this.props.expenses.size));
            this.setState({
                openUpdate: false,
                row: undefined
            });
        });
    };

    createExpense(entity) {
        createExpense(entity).then(() => {
            this.props.expenseActions(new PageParams(this.props.expenses.number, this.props.expenses.size));
            this.setState({
                openCreate: false
            });
        });
    };

    render() {
        return (
            <div>
                {this.props.expenses ? <TableRemote data={this.props.expenses.content}
                                                   page={this.props.expenses.number + 1}
                                                   columns={colExpense}
                                                   entity="расход"
                                                   sizePerPage={this.props.expenses.size}
                                                   remove={this.onOpenDeleteModal}
                                                   update={this.onOpenUpdateModal}
                                                   create={this.onOpenCreateModal}
                                                   totalSize={this.props.expenses.totalElements}
                                                   onTableChange={this.handleTableChange}/>
                    : null}

                {this.state.row ? <ExpenseModal accept={this.updateExpense}
                             open={this.state.openUpdate}
                             update={this.state.row}
                             close={this.onCloseUpdateModal} />: null}

                <ExpenseModal accept={this.createExpense}
                             open={this.state.openCreate}
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
