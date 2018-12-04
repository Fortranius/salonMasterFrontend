import React, {Component} from 'react';
import '../App.css';
import Modal from 'react-responsive-modal';

class DeleteModal extends Component {

    constructor() {
        super();
        this.refused = this.refused.bind(this);
        this.accept = this.accept.bind(this);
    }

    refused = () => {
        this.props.close();
    };

    accept = () => {
        this.props.accept();
    };

    render() {
        return (
            <div>
                <Modal open={this.props.open}
                       closeOnOverlayClick={false}
                       showCloseIcon={false}
                       onClose={this.refused}
                       closeOnEsc={false} center={false}>
                    <h2>Вы действительно хотите удалить {this.props.entity}?</h2>
                    <div className="button-group">
                        <button className="btn btn-primary" onClick={this.accept}>
                            Да
                        </button>
                        <button className="btn btn-primary" onClick={this.refused}>
                            Нет
                        </button>
                    </div>
                </Modal>
            </div>
        );
    }
}

export default DeleteModal;
