import React, {Component} from 'react';
import '../App.css';
import BootstrapTable from 'react-bootstrap-table-next';
import colClientSlot from "../data/colClientSlot";
import {getTimeSlotsByClientId} from "../service/timeSlotService";

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
                this.setState({
                    data: slots
                });
            });
        }
    }

    render() {
        const expandRow = {
            renderer: row => (
                <div>
                    {row.hairCountExtension>0 ? <p>{ `Количество наращенных прядей: ${row.hairCountExtension}` }</p> : null}
                    {row.hairWeight>0 ? <p>{ `Вес наращенных волос: ${row.hairWeight}` }</p> : null}
                    {row.hairCountRemoval>0 ? <p>{ `Количество сгятых прядей: ${row.hairCountRemoval}` }</p> : null}
                </div>
            )
        };
        return (
            <div className="main-div">
                <BootstrapTable
                    keyField="id"
                    expandableRow={true}
                    expandRow={ expandRow }
                    data={this.state.data}
                    columns={colClientSlot}
                />
            </div>
        );
    }
}

export default HistoryClients;
