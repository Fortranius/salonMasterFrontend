import React, {Component} from 'react';
import '../App.css';
import colProductBalance from "../data/colProductBalance";
import BootstrapTable from 'react-bootstrap-table-next';
import {getAllProductsBalance} from "../service/productBlanceService";
import {createIncoming} from "../service/balanceService";
import BalanceModal from "../modal/BalanceModal";

class Balance extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            openCreate: false
        };
        this.onOpenCreateModal = this.onOpenCreateModal.bind(this);
        this.onCloseCreateModal = this.onCloseCreateModal.bind(this);
        this.createIncoming = this.createIncoming.bind(this);

        getAllProductsBalance().then(data => {
            this.setState({
                data: data
            });
        });
    }

    createIncoming(entity) {
        createIncoming(entity).then(() => {
            getAllProductsBalance().then(data => {
                this.setState({
                    data: data,
                    openCreate: false
                });
            });
        });
    };

    onOpenCreateModal () {
        this.setState({
            openCreate: true
        });
    };

    onCloseCreateModal = () => {
        this.setState({
            openCreate: false
        });
    };

    render() {
        return (
            <div className="main-div">
                <div className="button-group">
                    <button onClick = { this.onOpenCreateModal } className="btn btn-primary">
                        Добавить приход продукта
                    </button>
                </div>
                <BootstrapTable
                    keyField="product.description"
                    data={this.state.data}
                    columns={colProductBalance}
                />
                <BalanceModal accept={this.createIncoming}
                              open={this.state.openCreate}
                              close={this.onCloseCreateModal} />
            </div>
        );
    }
}

export default Balance;
