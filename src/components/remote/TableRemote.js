import React, {Component} from 'react';
import '../../App.css';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory from 'react-bootstrap-table2-filter';

class TableRemote extends Component {

    constructor() {
        super();
        this.state = {
            select: undefined
        };
        this.handleOnSelect = this.handleOnSelect.bind(this);
        this.removeEntity = this.removeEntity.bind(this);
        this.updateEntity = this.updateEntity.bind(this);
    }

    handleOnSelect = (row) => {
        this.setState({
            select : row
        });
    };

    removeEntity() {
        this.props.remove(this.state.select.id);
    };

    updateEntity() {
        this.props.update(this.state.select);
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
                    <button className="btn btn-primary">
                        Добавить новго мастера
                    </button>
                    { this.state.select ? <button onClick = { this.removeEntity } className="btn btn-primary">
                        Удалить {this.props.entity}
                    </button>: null }
                    { this.state.select ? <button onClick = { this.updateEntity } className="btn btn-primary">
                        Редактировать {this.props.entity}
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
