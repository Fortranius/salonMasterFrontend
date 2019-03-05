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
import {getProcedures} from "../service/procedureService";
import typeFormatter from "../data/categoryMasterFormatter";

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

class UpdateModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            person: {
                phone: '',
                name:'',
                mail:''
            },
            procedure: {
                description: '',
                minPrice: 0,
                maxPrice: 0
            },
            type: '',
            selectType: undefined,
            procedures: [],
            submit: false,
            submitProcedure: false,
            selectedProcedures: [],
            optionProcedures: []
        };
        this.refused = this.refused.bind(this);
        this.accept = this.accept.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleChangePerson = this.handleChangePerson.bind(this);

        getProcedures().then(data => {
            let procedures = data.map(procedure => {
                return { value: procedure.id, label: procedure.description, procedure: procedure };
            });
            this.setState({
                optionProcedures: procedures
            });
        });
    }

    componentDidMount() {
        if (this.props.update) {
            let selectedProcedures = [];
            if (this.props.update.procedures)
                selectedProcedures = this.props.update.procedures.map(procedure => {
                    return { value: procedure.id, label: procedure.description, procedure: procedure };
                });
            let selectType = undefined;
            if (this.props.update.type)
                selectType = {
                    value: this.props.update.type,
                    label: typeFormatter(this.props.update.type)
                };
            this.setState({
                person: {
                    phone: this.props.update.person.phone ? this.props.update.person.phone : '',
                    name: this.props.update.person.name ? this.props.update.person.name : '',
                    mail: this.props.update.person.mail ? this.props.update.person.mail : '',
                },
                type: this.props.update.type ? this.props.update.type : '',
                selectType: selectType,
                procedures: this.props.update.procedures,
                selectedProcedures: selectedProcedures
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
            procedures:[],
            procedure: {
                description: '',
                minPrice: 0,
                maxPrice: 0
            },
            selectType: undefined,
            submit: false,
            submitProcedure: false,
            selectedProcedures: []
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
            && ((this.state.procedures && this.state.procedures.length>0)
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

    validate(field) {
        if (!this.state.submit)
            return false;
        if (field === 'phone')
            return this.state.person.phone.length !== 10;
        return (!this.state.person || !this.state.person[field]);
    };

    validateProcedures() {
        if (!this.state.submit)
            return false;
        return (!this.state || !this.state.procedures || this.state.procedures.length === 0);
    }

    validateState(field) {
        if (!this.state.submit)
            return false;
        return (!this.state || !this.state[field]);
    };

    handleChangeTypeMaster = (newValue) => {
        this.setState({
            type: newValue.value,
            selectType: newValue
        });
    };

    handleChangeProcedures = (selectedProcedures) => {
        let procedures = selectedProcedures.map(option => {
            return option.procedure;
        });
        this.setState({
            selectedProcedures: selectedProcedures,
            procedures: procedures
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
                        <FormControl className={classes.formControlServices} error={this.validateProcedures()} aria-describedby="procedures-error-text">
                            <Select id="procedures"
                                    isMulti
                                    closeMenuOnSelect={false}
                                    value={this.state.selectedProcedures}
                                    onChange={this.handleChangeProcedures}
                                    placeholder="Выберите услуги"
                                    options={this.state.optionProcedures}
                            />
                            { this.validateProcedures() ? <FormHelperText id="procedures-error-text">Необходимо выбрать хотя бы один вариант</FormHelperText>: null }
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
