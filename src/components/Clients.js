import React, {Component} from 'react';
import '../App.css';
import clients from "../data/clients";
import columsClient from "../data/columsClient";
import BootstrapTable from 'react-bootstrap-table-next';

class Clients extends Component {

    constructor(...args) {
        super(...args);
        this.state = {clients}
    }

    render() {
        return (
            <div>
                <BootstrapTable keyField='id' data={this.state.clients} columns={columsClient}/>
            </div>
        );
    }
}

export default Clients;
