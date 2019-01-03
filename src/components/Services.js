import React, {Component} from 'react';
import '../App.css';
import BootstrapTable from 'react-bootstrap-table-next';
import colService from "../data/colService";
import ServiceModal from "../modal/ServiceModal";
import {createService, getServices} from "../service/serviceService";

class Services extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            openUpdate: false,
            openCreate: false
        };
        this.createService = this.createService.bind(this);
        this.onCloseCreateModal = this.onCloseCreateModal.bind(this);
        this.onOpenCreateModal = this.onOpenCreateModal.bind(this);
        getServices().then(data => {
            this.setState({
                data: data
            });
        });
    }

    createService(entity) {
        createService(entity).then(() => {
            this.setState({
                openCreate: false
            });
            getServices().then(data => {
                this.setState({
                    data: data
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
            openCreate: true,
        });
    };

    render() {
        return (
            <div>
                <div className="button-group">
                    <button onClick = { this.onOpenCreateModal } className="btn btn-primary">
                        Добавить новую услугу
                    </button>
                </div>
                {this.state.data ?<BootstrapTable
                    keyField="id"
                    data={this.state.data}
                    columns={colService}
                />: null}
                <ServiceModal accept={this.createService}
                             open={this.state.openCreate}
                             close={this.onCloseCreateModal}
                             entity="мастера" />
            </div>
        );
    }
}

export default Services;
