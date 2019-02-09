import React, {Component} from 'react';
import '../App.css';
import BootstrapTable from 'react-bootstrap-table-next';
import colService from "../data/colService";
import ServiceModal from "../modal/ServiceModal";
import {createService, getServices, updateService} from "../service/serviceService";

class Services extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            openCreate: false,
            openUpdate: false
        };
        this.createService = this.createService.bind(this);
        this.updateService = this.updateService.bind(this);
        this.onCloseCreateModal = this.onCloseCreateModal.bind(this);
        this.onOpenCreateModal = this.onOpenCreateModal.bind(this);
        this.onCloseUpdateModal = this.onCloseUpdateModal.bind(this);
        this.onOpenUpdateModal = this.onOpenUpdateModal.bind(this);
        this.handleOnSelect = this.handleOnSelect.bind(this);
        getServices().then(data => {
            this.setState({
                data: data
            });
        });
    }

    createService(entity) {
        createService(entity).then(() => {
            getServices().then(data => {
                this.setState({
                    openCreate: false,
                    data: data
                });
            });
        });
    };

    updateService(entity) {
        updateService(entity).then(() => {
            getServices().then(data => {
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
            <div className="main-div">
                <div className="button-group">
                    <button onClick = { this.onOpenCreateModal } className="btn btn-primary">
                        Добавить новую услугу
                    </button>
                    { this.state.select ? <button onClick = { this.onOpenUpdateModal } className="btn btn-primary">
                        Редактировать услугу
                    </button> : null }
                </div>
                {this.state.data ? <BootstrapTable
                    keyField="id"
                    selectRow={ selectRow }
                    data={this.state.data}
                    columns={colService}
                />: null}
                <ServiceModal accept={this.createService}
                              open={this.state.openCreate}
                              close={this.onCloseCreateModal} />
                {this.state.openUpdate ? <ServiceModal accept={this.updateService}
                                                       open={this.state.openUpdate}
                                                       select={this.state.select}
                                                       close={this.onCloseUpdateModal} /> : null }
            </div>
        );
    }
}

export default Services;
