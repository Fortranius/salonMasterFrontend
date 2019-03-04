import React, {Component} from 'react';
import '../App.css';
import BootstrapTable from 'react-bootstrap-table-next';
import colProcedure from "../data/colProcedure";
import ServiceModal from "../modal/ProcedureModal";
import {createProcedure, getProcedures, updateProcedure} from "../service/procedureService";

class Procedures extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            openCreate: false,
            openUpdate: false
        };
        this.createProcedure = this.createProcedure.bind(this);
        this.updateProcedure = this.updateProcedure.bind(this);
        this.onCloseCreateModal = this.onCloseCreateModal.bind(this);
        this.onOpenCreateModal = this.onOpenCreateModal.bind(this);
        this.onCloseUpdateModal = this.onCloseUpdateModal.bind(this);
        this.onOpenUpdateModal = this.onOpenUpdateModal.bind(this);
        this.handleOnSelect = this.handleOnSelect.bind(this);
        getProcedures().then(data => {
            this.setState({
                data: data
            });
        });
    }

    createProcedure(entity) {
        createProcedure(entity).then(() => {
            getProcedures().then(data => {
                this.setState({
                    openCreate: false,
                    data: data
                });
            });
        });
    };

    updateProcedure(entity) {
        updateProcedure(entity).then(() => {
            getProcedures().then(data => {
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
                    columns={colProcedure}
                />: null}
                <ServiceModal accept={this.createProcedure}
                              open={this.state.openCreate}
                              close={this.onCloseCreateModal} />
                {this.state.openUpdate ? <ServiceModal accept={this.updateProcedure}
                                                       open={this.state.openUpdate}
                                                       select={this.state.select}
                                                       close={this.onCloseUpdateModal} /> : null }
            </div>
        );
    }
}

export default Procedures;
