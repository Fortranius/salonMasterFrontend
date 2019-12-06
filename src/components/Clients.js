import React, {Component} from 'react';
import '../App.css';
import TableRemote from "./remote/TableRemote";
import colClient from "../data/colClient";
import PageParams from "../model/PageParams";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {getClientsAction} from "../actions/clientActions";
import {createClient, removeClient, updateClient} from "../service/clientService";
import DeleteModal from "../modal/DeleteModal";
import ClientModal from "../modal/ClientModal";

class Clients extends Component {

    constructor(props) {
        super(props);
        this.state = {
            openDelete: false,
            openUpdate: false,
            openCreate: false,
            row: undefined
        };
        this.handleTableChange = this.handleTableChange.bind(this);

        this.removeClient = this.removeClient.bind(this);
        this.onOpenDeleteModal = this.onOpenDeleteModal.bind(this);
        this.onCloseDeleteModal = this.onCloseDeleteModal.bind(this);

        this.updateClient = this.updateClient.bind(this);
        this.onOpenUpdateModal = this.onOpenUpdateModal.bind(this);
        this.onCloseUpdateModal = this.onCloseUpdateModal.bind(this);

        this.createClient = this.createClient.bind(this);
        this.onOpenCreateModal = this.onOpenCreateModal.bind(this);
        this.onCloseCreateModal = this.onCloseCreateModal.bind(this);

        this.props.clientActions(new PageParams(0, 10));
    }

    onOpenDeleteModal (row) {
        this.setState({
            openDelete: true,
            row: row
        });
    };

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

    onCloseDeleteModal = () => {
        this.setState({
            openDelete: false,
            row: undefined
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
        this.props.clientActions(new PageParams(page - 1, sizePerPage));
    };

    updateClient(entity) {
        let client = this.state.row;
        client.person = entity.person;
        client.description = entity.description;
        updateClient(client).then(() => {
            this.props.clientActions(new PageParams(this.props.clients.number, this.props.clients.size));
            this.setState({
                openUpdate: false,
                row: undefined
            });
        });
    };

    createClient(entity) {
        createClient(entity).then(() => {
            this.props.clientActions(new PageParams(this.props.clients.number, this.props.clients.size));
            this.setState({
                openCreate: false
            });
        });
    };

    removeClient(id) {
        removeClient(id).then(() => {
            this.props.clientActions(new PageParams(this.props.clients.number, this.props.clients.size));
            this.setState({
                openDelete: false,
                row: undefined
            });
        });
    };

    render() {
        return (
            <div className="main-div">
                {this.props.clients ? <TableRemote data={this.props.clients.content}
                                                   page={this.props.clients.number + 1}
                                                   columns={colClient}
                                                   entity="клиента"
                                                   buttonCreateTitle='Создание нового клиента'
                                                   buttonEditTitle='Изменение клиента'
                                                   remove={this.onOpenDeleteModal}
                                                   update={this.onOpenUpdateModal}
                                                   create={this.onOpenCreateModal}
                                                   sizePerPage={this.props.clients.size}
                                                   totalSize={this.props.clients.totalElements}
                                                   onTableChange={this.handleTableChange}/>
                    : null}
                <DeleteModal accept={this.removeClient}
                             open={this.state.openDelete}
                             close={this.onCloseDeleteModal}
                             entity="клиента" />

                {this.state.row ? <ClientModal accept={this.updateClient}
                                               open={this.state.openUpdate}
                                               update={this.state.row}
                                               close={this.onCloseUpdateModal} />: null}

                <ClientModal accept={this.createClient}
                             open={this.state.openCreate}
                             close={this.onCloseCreateModal} />
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
