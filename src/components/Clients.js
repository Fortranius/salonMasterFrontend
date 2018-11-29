import React, {Component} from 'react';
import '../App.css';
import clients from "../data/clients";
import TableRemote from "./remote/TableRemote";
import colClient from "../data/colClient";

class Clients extends Component {

    constructor(props) {
        super(props);
        this.state = {
            page: 1,
            data: clients.slice(0, 10),
            totalSize: clients.length,
            sizePerPage: 10
        };
        this.handleTableChange = this.handleTableChange.bind(this);
    }

    handleTableChange = (type, {page, sizePerPage}) => {
        const currentIndex = (page - 1) * sizePerPage;
        this.setState(() => ({
            page,
            data: clients.slice(currentIndex, currentIndex + sizePerPage),
            sizePerPage
        }));
    };

    render() {
        return (
            <div>
                <TableRemote data={this.state.data}
                             page={this.state.page}
                             columns={colClient}
                             sizePerPage={this.state.sizePerPage}
                             totalSize={this.state.totalSize}
                             onTableChange={this.handleTableChange}/>
            </div>
        );
    }
}

export default Clients;
