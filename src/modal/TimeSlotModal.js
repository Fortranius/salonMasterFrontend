import React, {Component} from 'react';
import '../App.css';
import Modal from 'react-responsive-modal';
import {withStyles} from '@material-ui/core/styles';

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

class TimeSlotModal extends Component {

    constructor() {
        super();
        this.refused = this.refused.bind(this);
        this.accept = this.accept.bind(this);
    }

    refused = () => {
        this.props.close();
    };

    accept = () => {
        this.props.accept(this.state);
    };

    render() {
        const {classes} = this.props;
        return (
            <div>
                <Modal open={this.props.open}
                       closeOnOverlayClick={false}
                       showCloseIcon={false}
                       onClose={this.refused}
                       closeOnEsc={false} center={false}>
                    { this.props.start ? <div>

                        <div class="container">
                            <div class="row">
                                <div class="col-sm">
                                    Дата заказа:
                                </div>
                                <div class="col-sm">
                                    {this.props.start.toLocaleDateString()}
                                </div>
                            </div>
                            <hr/>
                            <div class="row">
                                <div class="col-sm">
                                    Время начала:
                                </div>
                                <div class="col-sm">
                                    {this.props.start.toLocaleTimeString()}
                                </div>
                                <div class="col-sm">
                                    Время завершения:
                                </div>
                                <div class="col-sm">
                                    {this.props.end.toLocaleTimeString()}
                                </div>
                            </div>
                            <hr/>
                        </div>
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
