import React, {Component} from 'react';
import '../App.css';
import Modal from 'react-responsive-modal';
import {withStyles} from '@material-ui/core/styles';
import AsyncPaginate from 'react-select-async-paginate';
import {getClientsByPhone} from "../service/clientService";

const styles = theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        marginTop: 16,
        width: 200
    },
    formControl: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        marginTop: 16,
        width: 200
    },
});

async function getOptionClients(search, loadedOptions) {
    const response = await getClientsByPhone(search);

    let cachedOptions = response.content.map((d) => ({
        value: d.id,
        label: d.person.name,
    }));
    return {
        options: cachedOptions,
        hasMore: true,
    };
}

class TimeSlotModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectClient: undefined
        };
        this.refused = this.refused.bind(this);
        this.accept = this.accept.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    refused = () => {
        this.props.close();
    };

    accept = () => {
        this.props.accept(this.state);
    };

    handleInputChange = (newValue) => {
        this.setState({
            selectClient: newValue
        });
    };

    render() {
        return (
            <div>
                <Modal open={this.props.open}
                       closeOnOverlayClick={false}
                       showCloseIcon={false}
                       onClose={this.refused}
                       closeOnEsc={false} center={false}>
                    { this.props.start ? <div>

                        <div className="container">
                            <div className="row">
                                <div className="col-sm">
                                    Дата заказа:
                                </div>
                                <div className="col-sm">
                                    {this.props.start.toLocaleDateString()}
                                </div>
                            </div>
                            <hr/>
                            <div className="row">
                                <div className="col-sm">
                                    Время начала:
                                </div>
                                <div className="col-sm">
                                    {this.props.start.toLocaleTimeString()}
                                </div>
                                <div className="col-sm">
                                    Время завершения:
                                </div>
                                <div className="col-sm">
                                    {this.props.end.toLocaleTimeString()}
                                </div>
                            </div>
                            <hr/>
                        </div>
                        <hr/>
                        <AsyncPaginate
                            value={this.state.selectClient}
                            loadOptions={getOptionClients}
                            onChange={this.handleInputChange}
                        />
                        <hr/>
                        </div>: null }
                    <div className="button-group">
                        <button className="btn btn-primary" onClick={this.accept}>
                            Сохранить
                        </button>
                        <button className="btn btn-primary" onClick={this.refused}>
                            Отмена
                        </button>
                    </div>
                </Modal>
            </div>
        );
    }
}

export default withStyles(styles)(TimeSlotModal);
