import React, {Component} from 'react';
import '../App.css';
import '../react-day-picker.css';
import Modal from 'react-responsive-modal';
import {withStyles} from '@material-ui/core/styles';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';

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
    formControlDescription: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        marginTop:16,
        width: 400
    }
});

class ProcedureModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            service: {
                description: ''
            },
            submit: false
        };
        this.refused = this.refused.bind(this);
        this.accept = this.accept.bind(this);
    }

    componentDidMount() {
        if (this.props.select)
            this.setState({
                service: this.props.select
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
        if (this.state.service.description) {
            this.props.accept(this.state.service);
            this.clear();
        }
    };

    clear() {
        this.setState({
            service: {
                description: ''
            },
            submit: false
        });
    }

    validate(field) {
        if (!this.state.submit)
            return false;
        return (!this.state.service || !this.state.service[field]);
    }

    handleChange = name => event => {
        this.setState({
            service: {
                ...this.state.service,
                [name]: event.target.value
            }
        });
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
                    <div>
                        <div className={classes.container}>
                            <FormControl className={classes.formControlDescription} error={this.validate('description')} aria-describedby="description-error-text">
                                <InputLabel htmlFor="description">Описание</InputLabel>
                                <Input id="description" value={this.state.service.description} onChange={this.handleChange('description')} />
                                { this.validate('description') ? <FormHelperText id="description-error-text">Поле не может быть пустым</FormHelperText>: null }
                            </FormControl>
                        </div>
                    </div>
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

export default withStyles(styles)(ProcedureModal);
