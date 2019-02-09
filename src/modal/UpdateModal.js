import React, {Component} from 'react';
import '../App.css';
import Modal from 'react-responsive-modal';
import {withStyles} from '@material-ui/core/styles';
import NumberFormat from 'react-number-format';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import masterTypeOptions from "../data/masterTypeOptions";
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

function NumberFormatCustomPhone(props) {
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

function NumberFormatCustomSum(props) {
    const { inputRef, onChange, ...other } = props;
    return (
        <NumberFormat
            {...other}
            getInputRef={inputRef}
            onValueChange={values => {
                onChange({
                    target: {
                        value: values.value,
                    },
                });
            }}
            thousandSeparator={' '}
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
                mail:''
            },
            service: {
                description: '',
                minPrice: 0,
                maxPrice: 0
            },
            type: '',
            selectType: undefined,
            services: [],
            submit: false,
            submitService: false,
            selectedServices: [],
            optionServices: []
        };
        this.refused = this.refused.bind(this);
        this.accept = this.accept.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleChangePerson = this.handleChangePerson.bind(this);
        this.handleChangeService = this.handleChangeService.bind(this);

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
            let selectedServices = [];
            if (this.props.update.services)
                selectedServices = this.props.update.services.map(service => {
                    return { value: service.id, label: service.description, service: service };
                });
            let selectType = undefined;
            if (this.props.update.type)
                selectType = {
                    value: this.props.update.type,
                    label: this.props.update.type
                };
            this.setState({
                person: {
                    phone: this.props.update.person.phone ? this.props.update.person.phone : '',
                    name: this.props.update.person.name ? this.props.update.person.name : '',
                    mail: this.props.update.person.mail ? this.props.update.person.mail : '',
                },
                type: this.props.update.type ? this.props.update.type : '',
                selectType: selectType,
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
                mail:''
            },
            type: '',
            services:[],
            service: {
                description: '',
                minPrice: 0,
                maxPrice: 0
            },
            selectType: undefined,
            submit: false,
            submitService: false,
            electedServices: []
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
            && this.state.person.phone.length === 10
            && ((this.state.services && this.state.services.length>0)
                || this.props.entity !== 'мастера')) {
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

    handleChangeService = name => event => {
        this.setState({
            service: {
                ...this.state.service,
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

    validateState(field) {
        if (!this.state.submit)
            return false;
        return (!this.state || !this.state[field]);
    };

    validateService(field) {
        if (!this.state.submitService)
            return false;
        return (!this.state.service || !this.state.service[field]);
    };

    removeService = (serviceIndex)  => {
        let array = [...this.state.services];
        array.splice(serviceIndex, 1);
        this.setState({services: array});
    };

    addService = ()  => {
        this.setState({
            submitService: true
        });
        if (this.state.service.description
            && this.state.service.minPrice) {
            let services = this.state.services;
            services.push(this.state.service);
            this.setState({
                services: services,
                service: {
                    description: '',
                    minPrice: 0,
                    maxPrice: 0
                },
                submitService:false
            });
        }
    };

    handleChangeTypeMaster = (newValue) => {
        this.setState({
            type: newValue.value,
            selectType: newValue
        });
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
            <div className="modal-div">
                <Modal open={this.props.open}
                       closeOnOverlayClick={false}
                       showCloseIcon={false}
                       onClose={this.refused}
                       closeOnEsc={false} center={false}>
                    { this.props.update ? <h2>Редактирование {this.props.entity}</h2>: null }
                    { !this.props.update ? <h2>Создание {this.props.entity}</h2>: null }
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
                        { this.props.entity === 'клиента' ? <FormControl className={classes.formControl} error={this.validate('description')} aria-describedby="description-error-text">
                            <InputLabel htmlFor="type">Описание</InputLabel>
                            <Input id="description" value={this.state.description} onChange={this.handleChange('description')} />
                            { this.validate('description') ? <FormHelperText id="description-error-text">Поле не может быть пустым</FormHelperText>: null }
                        </FormControl> : null}
                    </div>
                    { this.props.entity === 'мастера' ? <FormControl className={classes.formControl} error={this.validateState('type')} aria-describedby="type-error-text">
                        <InputLabel htmlFor="type">Категория</InputLabel>
                        <Select
                            value={this.state.selectType}
                            options={masterTypeOptions}
                            placeholder={'Выберите категорию'}
                            onChange={this.handleChangeTypeMaster}
                            className='selectMasterTypeStyle'
                        />
                        { this.validateState('type') ? <FormHelperText id="type-error-text">Поле не может быть пустым</FormHelperText>: null }
                    </FormControl> : null}
                    <hr/>
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

export default withStyles(styles)(UpdateModal);
