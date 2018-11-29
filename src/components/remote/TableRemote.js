import React, {Component} from 'react';
import '../../App.css';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import cellEditFactory from 'react-bootstrap-table2-editor';
import filterFactory from 'react-bootstrap-table2-filter';

class TableRemote extends Component {

    render() {
        const cellEditProps = {
            mode: 'click'
        };
        return (
            <div>
                <BootstrapTable
                    remote
                    keyField="id"
                    data={this.props.data}
                    columns={this.props.columns}
                    filter={filterFactory()}
                    cellEdit={cellEditFactory(cellEditProps)}
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
