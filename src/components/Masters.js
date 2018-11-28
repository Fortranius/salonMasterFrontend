import React, {Component} from 'react';
import '../App.css';
import BootstrapTable from 'react-bootstrap-table-next';
import masters from "../data/masters";
import columsMaster from "../data/columsMaster";

class Masters extends Component {

    constructor(...args) {
        super(...args);
        this.state = {masters}
    }

    render() {
        return (
            <div>
                <BootstrapTable keyField='id' data={this.state.masters} columns={columsMaster}/>
            </div>
        );
    }
}

export default Masters;
