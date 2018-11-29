import React, {Component} from 'react';
import '../App.css';
import masters from "../data/masters";
import TableRemote from "./remote/TableRemote";
import colMaster from "../data/colMaster";

class Masters extends Component {

    constructor(props) {
        super(props);
        this.state = {
            page: 1,
            data: masters.slice(0, 10),
            totalSize: masters.length,
            sizePerPage: 10
        };
        this.handleTableChange = this.handleTableChange.bind(this);
    }

    handleTableChange = (type, { page, sizePerPage }) => {
        const currentIndex = (page - 1) * sizePerPage;
        this.setState(() => ({
            page,
            data: masters.slice(currentIndex, currentIndex + sizePerPage),
            sizePerPage
        }));
    };

    render() {
        return (
            <div>
                <TableRemote data={ this.state.data }
                             page={ this.state.page }
                             columns={colMaster}
                             sizePerPage={ this.state.sizePerPage }
                             totalSize={ this.state.totalSize }
                             onTableChange={ this.handleTableChange }/>
            </div>
        );
    }
}

export default Masters;
