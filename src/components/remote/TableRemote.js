import React, {Component} from 'react';
import '../../App.css';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory from 'react-bootstrap-table2-filter';

class TableRemote extends Component {

    constructor(props) {
        super(props);
        this.state = {
            select: undefined
        };
        this.handleOnSelect = this.handleOnSelect.bind(this);
        this.removeEntity = this.removeEntity.bind(this);
        this.updateEntity = this.updateEntity.bind(this);
        this.createEntity = this.createEntity.bind(this);
    }

    handleOnSelect = (row) => {
        this.setState({
            select : row
        });
    };

    removeEntity() {
        this.props.remove(this.state.select.id);
        this.setState({
            select: undefined
        })
    };

    updateEntity() {
        this.props.update(this.state.select);
        this.setState({
            select: undefined
        })
    };

    createEntity() {
        this.props.create();
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
            <div>
                <div className="button-group">
                    <button onClick = { this.createEntity } className="btn btn-primary">
                        {this.props.buttonCreateTitle}
                    </button>
                    { this.state.select ? <button onClick = { this.updateEntity } className="btn btn-primary">
                        {this.props.buttonEditTitle}
                    </button>: null }
                </div>
                <hr/>
                <BootstrapTable
                    remote
                    keyField="id"
                    data={this.props.data}
                    columns={this.props.columns}
                    filter={filterFactory()}
                    selectRow={ selectRow }
                    pagination={paginationFactory({
                        page: this.props.page,
                        sizePerPage: this.props.sizePerPage,
                        totalSize: this.props.totalSize
                    })}
                    onTableChange={this.props.onTableChange}
                />
            </div>
        );
    }
}

export default TableRemote;
