import React, {Component} from 'react';
import '../App.css';
import TableRemote from "./remote/TableRemote";
import colMaster from "../data/colMaster";
import {connect} from 'react-redux';
import {getMastersAction} from "../actions/masterActions"
import {bindActionCreators} from 'redux'
import PageParams from '../model/PageParams'
import {createMaster, removeMaster, updateMaster} from "../service/masterService";
import DeleteModal from "../modal/DeleteModal";
import MasterModal from "../modal/MasterModal";

class Masters extends Component {

    constructor(props) {
        super(props);
        this.state = {
            openDelete: false,
            openUpdate: false,
            openCreate: false,
            row: undefined
        };
        this.handleTableChange = this.handleTableChange.bind(this);

        this.removeMaster = this.removeMaster.bind(this);
        this.onOpenDeleteModal = this.onOpenDeleteModal.bind(this);
        this.onCloseDeleteModal = this.onCloseDeleteModal.bind(this);

        this.updateMaster = this.updateMaster.bind(this);
        this.onOpenUpdateModal = this.onOpenUpdateModal.bind(this);
        this.onCloseUpdateModal = this.onCloseUpdateModal.bind(this);

        this.createMaster = this.createMaster.bind(this);
        this.onOpenCreateModal = this.onOpenCreateModal.bind(this);
        this.onCloseCreateModal = this.onCloseCreateModal.bind(this);

        this.props.masterActions(new PageParams(0, 50));
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
        this.props.masterActions(new PageParams(page - 1, sizePerPage));
    };

    removeMaster() {
        removeMaster(this.state.row.id).then(() => {
            this.props.masterActions(new PageParams(this.props.masters.number, this.props.masters.size));
            this.setState({
                openDelete: false,
                row: undefined
            });
        });
    };

    updateMaster(entity) {
        let master = this.state.row;
        master.person = entity.person;
        master.procedures = entity.procedures;
        master.type = entity.type;
        master.workingDay = entity.workingDay;
        master.startDateWork = entity.startDateWork;
        master.workDays = entity.workDays;
        updateMaster(master).then(() => {
            this.props.masterActions(new PageParams(this.props.masters.number, this.props.masters.size));
            this.setState({
                openUpdate: false,
                row: undefined
            });
        });
    };

    createMaster(entity) {
        createMaster(entity).then(() => {
            this.props.masterActions(new PageParams(this.props.masters.number, this.props.masters.size));
            this.setState({
                openCreate: false
            });
        });
    };

    render() {
        return (
            <div className="main-div">
                {this.props.masters ? <TableRemote data={this.props.masters.content}
                                                   page={this.props.masters.number + 1}
                                                   columns={colMaster}
                                                   entity="мастера"
                                                   buttonCreateTitle='Создание нового мастера'
                                                   buttonEditTitle='Изменение мастера'
                                                   sizePerPage={this.props.masters.size}
                                                   remove={this.onOpenDeleteModal}
                                                   update={this.onOpenUpdateModal}
                                                   create={this.onOpenCreateModal}
                                                   totalSize={this.props.masters.totalElements}
                                                   onTableChange={this.handleTableChange}/>
                    : null}
                <DeleteModal accept={this.removeMaster}
                             open={this.state.openDelete}
                             close={this.onCloseDeleteModal}
                             entity="мастера" />

                {this.state.row ? <MasterModal accept={this.updateMaster}
                             open={this.state.openUpdate}
                             update={this.state.row}
                             close={this.onCloseUpdateModal} />: null}

                <MasterModal accept={this.createMaster}
                             open={this.state.openCreate}
                             close={this.onCloseCreateModal} />
            </div>
        );
    }
}

const mapStateToProps = state => ({
    masters: state.masterReducer.masters
});

function mapDispatchToProps(dispatch) {
    return {
        masterActions: bindActionCreators(getMastersAction, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Masters);
