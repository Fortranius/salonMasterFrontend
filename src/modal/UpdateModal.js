import React, {Component} from 'react';
import '../App.css';
import Modal from 'react-responsive-modal';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import MaskedInput from 'react-text-mask';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';

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
});

function PhoneCustom(props) {
    const { inputRef, ...other } = props;

    return (
        <MaskedInput
            {...other}
            ref={inputRef}
            mask={['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
            placeholderChar={'\u2000'}
            showMask
        />
    );
}

class UpdateModal extends Component {

    constructor() {
        super();
        this.state = {
            phone: '(  )    -    ',
            name:'',
            surname:'',
            patronymic:'',
            mail:'',
        };
        this.refused = this.refused.bind(this);
        this.accept = this.accept.bind(this);
    }

    refused = () => {
        this.props.close();
    };

    accept = () => {
        this.props.accept();
    };

    handleChange = name => event => {
        this.props.handleChange(name, event.target.value);
    };

    render() {
        const { classes } = this.props;
        return (
            <div>
                <Modal open={this.props.open}
                       closeOnOverlayClick={false}
                       showCloseIcon={false}
                       onClose={this.refused}
                       closeOnEsc={false} center={false}>
                    <h2>Редактирование {this.props.entity}</h2>
                    { this.props.update ? <div className="form-group">
                        <TextField
                            label="Фамилия"
                            value={this.props.update.surname}
                            onChange={this.handleChange('surname')}
                            className={classes.textField}
                            type="text"
                            margin="normal"
                        />
                        <TextField
                            label="Имя"
                            value={this.props.update.name}
                            onChange={this.handleChange('name')}
                            className={classes.textField}
                            type="text"
                            margin="normal"
                        />
                        <TextField
                            label="Отчество"
                            value={this.props.update.patronymic}
                            onChange={this.handleChange('patronymic')}
                            className={classes.textField}
                            type="text"
                            margin="normal"
                        />
                        <FormControl className={classes.formControl}>
                            <InputLabel htmlFor="phone">Телефон</InputLabel>
                            <Input
                                value={this.props.update.phone}
                                id="phone"
                                onChange={this.handleChange('phone')}
                                inputComponent={PhoneCustom}
                            />
                        </FormControl>
                        <TextField
                            label="Почта"
                            value={this.props.update.mail}
                            onChange={this.handleChange('mail')}
                            className={classes.textField}
                            type="text"
                            margin="normal"
                        />
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

export default withStyles(styles)(UpdateModal);
