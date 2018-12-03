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
        this.removeMaster = this.removeMaster.bind(this);
    }

    handleOnSelect = (row) => {
        this.setState({
            select : row
        });
    };

    removeMaster() {
        this.props.remove(this.state.select.id);
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
                    { this.state.select ? <button onClick = { this.removeMaster } className="btn btn-primary">
                        Удалить мастера
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
