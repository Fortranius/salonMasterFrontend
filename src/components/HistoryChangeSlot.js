import React, {Component} from 'react';
import '../App.css';
import BootstrapTable from 'react-bootstrap-table-next';
import colChangeSlot from "../data/colChangeSlot";

class HistoryChangeSlot extends Component {

    render() {
        return (
            <div className="main-div">
                <BootstrapTable
                    keyField="date"
                    data={this.props.changes}
                    columns={colChangeSlot}
                />
            </div>
        );
    }
}

export default HistoryChangeSlot;
