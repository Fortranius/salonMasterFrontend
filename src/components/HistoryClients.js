import React, {Component} from 'react';
import '../App.css';
import BootstrapTable from 'react-bootstrap-table-next';
import colClientSlot from "../data/colClientSlot";
import {getTimeSlotsByClientId} from "../service/timeSlotService";
import moment from 'moment'

class HistoryClients extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: []
        }
    }

    componentDidMount() {
        if (this.props.client) {
            getTimeSlotsByClientId(this.props.client.id).then(slots => {
                let data = slots.map(slot => {
                    return {
                        id: slot.id,
                        master: slot.master.person.name,
                        price: slot.allPrice.toLocaleString() + " руб.",
                        status: this.getStatus(slot.status),
                        date: moment.unix(slot.startSlot).toDate().toLocaleDateString()
                    }
                });
                this.setState({
                    data: data
                });
            });
        }
    }

    getStatus(status) {
        if (status === 'NEW') return 'Ожидание клиента';
        if (status === 'DONE') return 'Клиент пришел';
        if (status === 'CANCELED') return 'Клиент не пришел';
        if (status === 'READY') return 'Клиент подтвердил';
    }
    render() {
        return (
            <div className="main-div">
                <BootstrapTable
                    keyField="id"
                    data={this.state.data}
                    columns={colClientSlot}
                />
            </div>
        );
    }
}

export default HistoryClients;
