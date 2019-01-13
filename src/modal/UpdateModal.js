import React, {Component} from 'react';
import '../App.css';
import Modal from 'react-responsive-modal';
import {withStyles} from '@material-ui/core/styles';
import NumberFormat from 'react-number-format';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Select from 'react-select';
import {getServices} from "../service/serviceService";

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

function NumberFormatCustom(props) {
    const { inputRef, onChange, ...other } = props;

    return (
        <NumberFormat
            {...other}
            getInputRef={inputRef}
            format="+7 (###) ###-####" mask="_"
            onValueChange={values => {
                onChange({
                    target: {
                        value: values.value,
                    },
                });
            }}
            thousandSeparator
            prefix="$"
        />
    );
}

class UpdateModal extends Component {

    constructor() {
        super();
        this.state = {
            person: {
                phone: '',
                name:'',
                surname:'',
                patronymic:'',
                mail:''
            },
            services:[],
            submit: false,
            selectedServices: [],
            optionServices: []
        };
        this.refused = this.refused.bind(this);
        this.accept = this.accept.bind(this);
        this.handleChange = this.handleChange.bind(this);

        getServices().then(data => {
            let services = data.map(service => {
                return { value: service.id, label: service.description, service: service };
            });
            this.setState({
                optionServices: services
            });
        });
    }

    componentDidMount() {
        if (this.props.update) {
            let selectedServices = this.props.update.services.map(service => {
                return { value: service.id, label: service.description, service: service };
            });
            this.setState({
                person: {
                    phone: this.props.update.person.phone ? this.props.update.person.phone : '',
                    name: this.props.update.person.name ? this.props.update.person.name : '',
                    surname: this.props.update.person.surname ? this.props.update.person.surname : '',
                    patronymic: this.props.update.person.patronymic ? this.props.update.person.patronymic : '',
                    mail: this.props.update.person.mail ? this.props.update.person.mail : '',
                },
                services: this.props.update.services,
                selectedServices: selectedServices
            });
        }
    }

    clear() {
        this.setState({
            person: {
                phone: '',
                name:'',
                surname:'',
                patronymic:'',
                mail:''
            },
            services:[],
            submit: false,
            selectedServices: []
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
            && this.state.person.surname
            && this.state.person.patronymic
            && this.state.person.mail
            && this.state.person.phone.length === 10
            && ((this.state.services && this.state.services.length>0)
                || this.props.entity !== 'мастера')) {
            this.props.accept(this.state);
            this.clear();
        }
    };

    handleChange = name => event => {
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
        if (field === 'service')
            return this.state.selectedServices.length === 0;
        return (!this.state.person || !this.state.person[field]);
    };

    handleChangeServices = (selectedServices) => {
        let services = selectedServices.map(option => {
            return option.service;
        });
        this.setState({
            selectedServices: selectedServices,
            services: services
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
                    { this.props.update ? <h2>Редактирование {this.props.entity}</h2>: null }
                    { !this.props.update ? <h2>Создание {this.props.entity}</h2>: null }
                    <div className={classes.container}>
                        <FormControl className={classes.formControl} error={this.validate('surname')} aria-describedby="surname-error-text">
                            <InputLabel htmlFor="surname">Фамиля</InputLabel>
                            <Input id="surname" value={this.state.person.surname} onChange={this.handleChange('surname')} />
                            { this.validate('surname') ? <FormHelperText id="surname-error-text">Поле не может быть пустым</FormHelperText>: null }
                        </FormControl>
                        <FormControl className={classes.formControl} error={this.validate('name')} aria-describedby="name-error-text">
                            <InputLabel htmlFor="name">Имя</InputLabel>
                            <Input id="name" value={this.state.person.name} onChange={this.handleChange('name')} />
                            { this.validate('name') ? <FormHelperText id="name-error-text">Поле не может быть пустым</FormHelperText>: null }
                        </FormControl>
                        <FormControl className={classes.formControl} error={this.validate('patronymic')} aria-describedby="patronymic-error-text">
                            <InputLabel htmlFor="patronymic">Отчество</InputLabel>
                            <Input id="patronymic" value={this.state.person.patronymic} onChange={this.handleChange('patronymic')} />
                            { this.validate('patronymic') ? <FormHelperText id="patronymic-error-text">Поле не может быть пустым</FormHelperText>: null }
                        </FormControl>
                        <FormControl className={classes.formControl} error={this.validate('phone')} aria-describedby="phone-error-text">
                            <InputLabel htmlFor="phone">Телефон</InputLabel>
                            <Input id="phone" value={this.state.person.phone} inputComponent={NumberFormatCustom} onChange={this.handleChange('phone')} />
                            { this.validate('phone') ? <FormHelperText id="phone-error-text">Телефон введен неверно</FormHelperText>: null }
                        </FormControl>
                        <FormControl className={classes.formControl} error={this.validate('mail')} aria-describedby="mail-error-text">
                            <InputLabel htmlFor="mail">Почта</InputLabel>
                            <Input id="mail" value={this.state.person.mail} onChange={this.handleChange('mail')} />
                            { this.validate('mail') ? <FormHelperText id="mail-error-text">Поле не может быть пустым</FormHelperText>: null }
                        </FormControl>
                    </div>
                    { this.props.entity === 'мастера' ? <div>
                        <hr/>
                        <FormControl className={classes.formControlServices} error={this.validate('service')} aria-describedby="service-error-text">
                            <Select id="service"
                                isMulti
                                closeMenuOnSelect={false}
                                value={this.state.selectedServices}
                                onChange={this.handleChangeServices}
                                placeholder="Выберите услуги"
                                options={this.state.optionServices}
                            />
                            { this.validate('service') ? <FormHelperText id="service-error-text">Необходимо выбрать хотя бы один вариант</FormHelperText>: null }
                        </FormControl>
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
