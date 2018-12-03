import React, {Component} from 'react';
import '../App.css';
import TableRemote from "./remote/TableRemote";
import colMaster from "../data/colMaster";
import {connect} from 'react-redux';
import {getMastersAction} from "../actions/masterActions"
import {bindActionCreators} from 'redux'
import PageParams from '../model/PageParams'
import {removeMaster} from "../service/masterService";
import DeleteModal from "../modal/DeleteModal";

class Masters extends Component {

    constructor(props) {
        super(props);
        this.state = {
            openDelete: false,
            idDelete: undefined
        };
        this.handleTableChange = this.handleTableChange.bind(this);
        this.removeMaster = this.removeMaster.bind(this);
        this.onOpenDeleteModal = this.onOpenDeleteModal.bind(this);
        this.onCloseDeleteModal = this.onCloseDeleteModal.bind(this);
        this.props.masterActions(new PageParams(0, 10));
    }

    onOpenDeleteModal (id) {
        this.setState({
            openDelete: true,
            idDelete: id
        });
    };

    onCloseDeleteModal = () => {
        this.setState({
            openDelete: false,
            idDelete: undefined
        });
    };

    handleTableChange = (type, {page, sizePerPage}) => {
        this.props.masterActions(new PageParams(page - 1, sizePerPage));
    };

    removeMaster() {
        removeMaster(this.state.idDelete).then(() => {
            this.props.masterActions(new PageParams(this.props.masters.number, this.props.masters.size));
            this.setState({
                openDelete: false,
                idDelete: undefined
            });
        });
    };

    render() {
        return (
            <div>
                {this.props.masters ? <TableRemote data={this.props.masters.content}
                                                   page={this.props.masters.number + 1}
                                                   columns={colMaster}
                                                   sizePerPage={this.props.masters.size}
                                                   remove={this.onOpenDeleteModal}
                                                   totalSize={this.props.masters.totalElements}
                                                   onTableChange={this.handleTableChange}/>
                    : null}
                <DeleteModal acceptDelete={this.removeMaster}
                             openDelete={this.state.openDelete}
                             closeDelete={this.onCloseDeleteModal}
                             entity="мастера" />
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
