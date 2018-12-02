import React, {Component} from 'react';
import '../App.css';
import TableRemote from "./remote/TableRemote";
import colClient from "../data/colClient";
import PageParams from "../model/PageParams";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {getClientsAction} from "../actions/clientActions";

class Clients extends Component {

    constructor(props) {
        super(props);
        this.handleTableChange = this.handleTableChange.bind(this);
        this.props.clientActions(new PageParams(0, 10));
    }

    handleTableChange = (type, {page, sizePerPage}) => {
        this.props.clientActions(new PageParams(page - 1, sizePerPage));
    };

    render() {
        return (
            <div>
                {this.props.clients ? <TableRemote data={this.props.clients.content}
                                                   page={this.props.clients.number + 1}
                                                   columns={colClient}
                                                   sizePerPage={this.props.clients.size}
                                                   totalSize={this.props.clients.totalElements}
                                                   onTableChange={this.handleTableChange}/>
                    : null}
            </div>
        );
    }
}

const mapStateToProps = state => ({
    clients: state.clientReducer.clients
});

function mapDispatchToProps(dispatch) {
    return {
        clientActions: bindActionCreators(getClientsAction, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Clients);
