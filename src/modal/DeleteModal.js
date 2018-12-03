import React, {Component} from 'react';
import '../App.css';
import Modal from 'react-responsive-modal';

class DeleteModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false,
        };
        this.refusedCloseModal = this.refusedCloseModal.bind(this);
        this.acceptCloseModal = this.acceptCloseModal.bind(this);
    }

    refusedCloseModal = () => {
        this.props.closeDelete();
    };

    acceptCloseModal = () => {
        this.props.acceptDelete();
    };

    render() {
        return (
            <div>
                <Modal open={this.props.openDelete}
                       closeOnOverlayClick={false}
                       showCloseIcon={false}
                       onClose={this.refusedCloseModal}
                       closeOnEsc={false} center={false}>
                    <h2>Вы действительно хотите удалить {this.props.entity}?</h2>
                    <div className="button-group">
                        <button className="btn btn-primary" onClick={this.acceptCloseModal}>
                            Да
                        </button>
                        <button className="btn btn-primary" onClick={this.refusedCloseModal}>
                            Нет
                        </button>
                    </div>
                </Modal>
            </div>
        );
    }
}

export default DeleteModal;
