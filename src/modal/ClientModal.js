import React, {Component} from 'react';
import '../App.css';
import Modal from 'react-responsive-modal';
import {withStyles} from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import {NumberFormatCustomPhone} from "../data/formatter";

const styles = theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        marginTop:16,
        width: 200
    },
    formControl: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        marginTop:16,
        width: 200
    },
    formControlServices: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        marginTop:16,
        width: 400
    },
});

class ClientModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            person: {
                phone: '',
                name: '',
                mail: ''
            },
            description: '',
            submit: false
        };
        this.refused = this.refused.bind(this);
        this.accept = this.accept.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleChangePerson = this.handleChangePerson.bind(this);
    }

    componentDidMount() {
        if (this.props.update) {
            this.setState({
                person: {
                    phone: this.props.update.person.phone ? this.props.update.person.phone : '',
                    name: this.props.update.person.name ? this.props.update.person.name : '',
                    mail: this.props.update.person.mail ? this.props.update.person.mail : '',
                },
                description: this.props.update.description
            });
        }
    }

    clear() {
        this.setState({
            person: {
                phone: '',
                name: '',
                mail: ''
            },
            description: '',
            submit: false
        });
    }


    refused = () => {
        this.props.close();
        this.clear();
    };

    accept = () => {
        this.setState({
            submit: true
        });
        if (this.state.person.name
            && this.state.person.phone.length === 11) {
            this.props.accept(this.state);
            this.clear();
        }
    };

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value
        });
    };

    handleChangePerson = name => event => {
        this.setState({
            person: {
                ...this.state.person,
                [name]: event.target.value
            }
        });
    };

    validate(field) {
        if (!this.state.submit)
            return false;
        if (field === 'phone')
            return this.state.person.phone.length !== 10;
        return (!this.state.person || !this.state.person[field]);
    };

    render() {
        const { classes } = this.props;
        return (
            <div className="modal-div">
                <Modal open={this.props.open}
                       closeOnOverlayClick={false}
                       showCloseIcon={false}
                       onClose={this.refused}
                       closeOnEsc={false} center={false}>
                    { this.props.update ? <h2>Изменение клиента</h2>: null }
                    { !this.props.update ? <h2>Создание клиента</h2>: null }
                    <div className={classes.container}>
                        <FormControl className={classes.formControl} error={this.validate('name')} aria-describedby="name-error-text">
                            <InputLabel htmlFor="name">Имя</InputLabel>
                            <Input id="name" value={this.state.person.name} onChange={this.handleChangePerson('name')} />
                            { this.validate('name') ? <FormHelperText id="name-error-text">Поле не может быть пустым</FormHelperText>: null }
                        </FormControl>
                        <FormControl className={classes.formControl} error={this.validate('phone')} aria-describedby="phone-error-text">
                            <InputLabel htmlFor="phone">Телефон</InputLabel>
                            <Input id="phone" value={this.state.person.phone} inputComponent={NumberFormatCustomPhone} onChange={this.handleChangePerson('phone')} />
                            { this.validate('phone') ? <FormHelperText id="phone-error-text">Телефон введен неверно</FormHelperText>: null }
                        </FormControl>
                        <FormControl className={classes.formControl} error={this.validate('mail')} aria-describedby="mail-error-text">
                            <InputLabel htmlFor="mail">Почта</InputLabel>
                            <Input id="mail" value={this.state.person.mail} onChange={this.handleChangePerson('mail')} />
                        </FormControl>
                        <FormControl className={classes.formControl} error={this.validate('description')} aria-describedby="description-error-text">
                            <InputLabel htmlFor="type">Описание</InputLabel>
                            <Input id="description" value={this.state.description} onChange={this.handleChange('description')} />
                            { this.validate('description') ? <FormHelperText id="description-error-text">Поле не может быть пустым</FormHelperText>: null }
                        </FormControl>
                    </div>
                    <hr/>
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

export default withStyles(styles)(ClientModal);
