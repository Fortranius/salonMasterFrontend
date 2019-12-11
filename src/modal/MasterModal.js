import React, {Component} from 'react';
import '../App.css';
import Modal from 'react-responsive-modal';
import {withStyles} from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Select from 'react-select';
import {getProcedures} from "../service/procedureService";
import DayPickerInput from 'react-day-picker/DayPickerInput';
import MomentLocaleUtils, {formatDate, parseDate} from 'react-day-picker/moment';
import {NumberFormatCustomPhone, typeMasterFormatter, typeMasterWorkingDayFormatter} from "../data/formatter";
import moment from "moment/moment";
import {masterTypeOptions, masterWorkOptions} from "../data/selectOptions";
import DayPicker, {DateUtils} from 'react-day-picker';
import 'moment/locale/ru';

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

class MasterModal extends Component {

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
            workDays: [],
            type: '',
            selectType: undefined,
            procedures: [],
            submit: false,
            submitProcedure: false,
            selectedProcedures: [],
            optionProcedures: [],
            startDateWork: new Date(),
            workingDay: '',
            selectWorkingDay: undefined,
            startDate: moment().subtract(6, 'months').toDate(),
            endDate: moment().add(6, 'months').toDate(),
            currentDate: moment().subtract(1, 'months').toDate()
        };
        this.refused = this.refused.bind(this);
        this.accept = this.accept.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleChangePerson = this.handleChangePerson.bind(this);
        this.handleDayClick = this.handleDayClick.bind(this);

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
            let selectType, selectWorkingDay = undefined;
            if (this.props.update.type) {
                selectType = {
                    value: this.props.update.type,
                    label: typeMasterFormatter(this.props.update.type)
                };

            }
            if (this.props.update.workingDay) {
                selectWorkingDay = {
                    value: this.props.update.workingDay,
                    label: typeMasterWorkingDayFormatter(this.props.update.workingDay)
                };
            }
            this.setState({
                person: {
                    phone: this.props.update.person.phone ? this.props.update.person.phone : '',
                    name: this.props.update.person.name ? this.props.update.person.name : '',
                    mail: this.props.update.person.mail ? this.props.update.person.mail : '',
                },
                workDays: this.props.update.workDays ? this.props.update.workDays
                    .map(value => moment.unix(value).toDate()) : [],
                type: this.props.update.type ? this.props.update.type : '',
                selectType: selectType,
                procedures: this.props.update.procedures,
                selectedProcedures: selectedProcedures,
                selectWorkingDay: selectWorkingDay,
                workingDay: this.props.update.workingDay,
                startDateWork: this.props.update.startDateWork ? moment.unix(this.props.update.startDateWork).toDate() : new Date(),
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
            procedures: [],
            procedure: {
                description: '',
                minPrice: 0,
                maxPrice: 0
            },
            workDays: [],
            selectType: undefined,
            submit: false,
            submitProcedure: false,
            selectedProcedures: [],
            startDateWork: new Date(),
            workingDay: '',
            selectWorkingDay: undefined
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
            && this.state.procedures
            && this.state.procedures.length>0) {
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

    handleChangeWorkingDay = (newValue) => {
        this.setState({
            workingDay: newValue.value,
            selectWorkingDay: newValue
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

    handleChangeDate = (newValue) => {
        this.setState({
            startDateWork: newValue
        });
    };

    handleDayClick(day, { selected }) {
        const { workDays } = this.state;
        if (selected) {
            const selectedIndex = workDays.findIndex(selectedDay =>
                DateUtils.isSameDay(selectedDay, day)
            );
            workDays.splice(selectedIndex, 1);
        } else {
            workDays.push(day);
        }
        this.setState({ workDays });
    }

    render() {
        const { classes } = this.props;
        return (
            <div className="modal-div">
                <Modal open={this.props.open}
                       closeOnOverlayClick={false}
                       showCloseIcon={false}
                       onClose={this.refused}
                       closeOnEsc={false} center={false}>
                    { this.props.update ? <h2>Редактирование мастера</h2>: null }
                    { !this.props.update ? <h2>Создание мастера</h2>: null }
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
                    </div>
                    <hr/>
                    <div className="row">
                        <div className="col-sm-2">
                            Дата начала работы:
                        </div>
                        <div className="col-sm-4">
                            <DayPickerInput
                                placeholder={``}
                                parseDate={parseDate}
                                value={this.state.startDateWork}
                                onDayChange={this.handleChangeDate}
                                formatDate={formatDate}
                                dayPickerProps={{
                                    locale: 'ru',
                                    localeUtils: MomentLocaleUtils,
                                }}/>
                            <FormControl className={classes.formControl} error={this.validateState('startDateWork')} aria-describedby="startDateWork-error-text">
                                { this.validateState('startDateWork') ? <FormHelperText id="startDateWork-error-text">Поле не может быть пустым</FormHelperText>: null }
                            </FormControl>
                        </div>
                        <div className="col-sm-2">
                            График работы:
                        </div>
                        <div className="col-sm-4">
                            <Select
                                value={this.state.selectWorkingDay}
                                options={masterWorkOptions()}
                                placeholder={'Выберите график'}
                                onChange={this.handleChangeWorkingDay}
                            />
                            <FormControl className={classes.formControl} error={this.validateState('workingDay')} aria-describedby="workingDay-error-text">
                                { this.validateState('workingDay') ? <FormHelperText id="workingDay-error-text">Поле не может быть пустым</FormHelperText>: null }
                            </FormControl>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-sm-2">
                            Категория мастера:
                        </div>
                        <div className="col-sm-4">
                            <Select
                                value={this.state.selectType}
                                options={masterTypeOptions()}
                                placeholder={'Выберите категорию'}
                                onChange={this.handleChangeTypeMaster}
                            />
                            <FormControl className={classes.formControl} error={this.validateState('type')} aria-describedby="type-error-text">
                                { this.validateState('type') ? <FormHelperText id="type-error-text">Поле не может быть пустым</FormHelperText>: null }
                            </FormControl>
                        </div>
                        <div className="col-sm-2">
                            Услуги мастера:
                        </div>
                        <div className="col-sm-4">
                            <Select id="procedures"
                                    isMulti
                                    closeMenuOnSelect={false}
                                    value={this.state.selectedProcedures}
                                    onChange={this.handleChangeProcedures}
                                    placeholder="Выберите услуги"
                                    options={this.state.optionProcedures}
                            />
                            <FormControl className={classes.formControl} error={this.validateProcedures()} aria-describedby="procedures-error-text">
                                { this.validateProcedures() ? <FormHelperText id="procedures-error-text">Поле не может быть пустым</FormHelperText>: null }
                            </FormControl>
                        </div>
                    </div>
                    <hr/>
                    <h3>
                        Рабочие и выходные дни
                    </h3>
                    <DayPicker selectedDays={this.state.workDays}
                               numberOfMonths={8}
                               month={this.state.currentDate}
                               fromMonth={this.state.startDate}
                               toMonth={this.state.endDate}
                               localeUtils={MomentLocaleUtils} locale='ru'
                               onDayClick={this.handleDayClick}/>
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

export default withStyles(styles)(MasterModal);
