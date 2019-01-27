import React, {Component} from 'react';
import '../../App.css';

class ExpenseItem extends Component {

    constructor(props) {
        super(props);
        this.onClickDelete = this.onClickDelete.bind(this);
    }
    onClickDelete() {
        let index = parseInt(this.props.index);
        this.props.removeExpense(index);
    }

    render() {
        return (
            <li className="list-group-item ">
                <div>
                    Акссесуар - {this.props.item.product.description}. Количество - {this.props.item.countProduct}.
                    <button type="button" className="close" onClick={this.onClickDelete}>&times;</button>
                </div>
            </li>
        );
    }
}

class ExpenseList extends React.Component {
    render () {
        let items = this.props.expenses.map((item, index) => {
            return (
                <ExpenseItem key={index} item={item} index={index} removeExpense={this.props.removeExpense} />
            );
        });
        return (
            <ul className="list-group"> {items} </ul>
        );
    }
}

export default ExpenseList;
