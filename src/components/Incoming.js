import React, {Component} from 'react';
import '../App.css';
import {connect} from 'react-redux';
import {getExpensesAction} from "../actions/expenseActions"
import {bindActionCreators} from 'redux'

class Incoming extends Component {

    constructor(props) {
        super(props);

    }

    render() {
        return (
            <div className="main-div">
                Incoming
            </div>
        );
    }
}

const mapStateToProps = state => ({
    Incoming: state.expenseReducer.Incoming
});

function mapDispatchToProps(dispatch) {
    return {
        IncomingActions: bindActionCreators(getExpensesAction, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Incoming);
