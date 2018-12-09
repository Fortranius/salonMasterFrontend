import React, {Component} from 'react';
import '../App.css';
import Modal from 'react-responsive-modal';
import {withStyles} from '@material-ui/core/styles';
import AsyncSelect from 'react-select/lib/Async';
import {Dropdown} from 'semantic-ui-react'

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

export const colourOptions = [
    { value: 'ocean', label: 'Ocean', color: '#00B8D9', isFixed: true },
    { value: 'blue', label: 'Blue', color: '#0052CC', disabled: true },
    { value: 'purple', label: 'Purple', color: '#5243AA' },
    { value: 'red', label: 'Red', color: '#FF5630', isFixed: true },
    { value: 'orange', label: 'Orange', color: '#FF8B00' },
    { value: 'yellow', label: 'Yellow', color: '#FFC400' },
    { value: 'green', label: 'Green', color: '#36B37E' },
    { value: 'forest', label: 'Forest', color: '#00875A' },
    { value: 'slate', label: 'Slate', color: '#253858' },
    { value: 'silver', label: 'Silver', color: '#666666' },
];

const filterColors = (inputValue) => {
    if (inputValue) {
        return colourOptions.filter(i =>
            i.label.toLowerCase().includes(inputValue.toLowerCase())
        );
    }
    return colourOptions;
};

const loadOptions = (inputValue, callback) => {
    setTimeout(() => {
        callback(filterColors(inputValue));
    }, 1000);
};

class TimeSlotModal extends Component {

    constructor() {
        super();
        this.state = {
            inputValue: '',
            isFetching: false,
            multiple: true,
            search: true,
            searchQuery: null,
            value: [],
            options: [
                {
                    "key": "Mrs. Vladimir Hills",
                    "text": "Mrs. Vladimir Hills",
                    "value": "mrs_vladimir_hills"
                },
                {
                    "key": "Schuyler Hintz PhD",
                    "text": "Schuyler Hintz PhD",
                    "value": "schuyler_hintz_ph_d"
                },
                {
                    "key": "Madisen Johns",
                    "text": "Madisen Johns",
                    "value": "madisen_johns"
                }
            ]
        };
        this.refused = this.refused.bind(this);
        this.accept = this.accept.bind(this);
    }

    refused = () => {
        this.props.close();
    };

    accept = () => {
        this.props.accept(this.state);
    };

    handleInputChange = (newValue) => {
        const inputValue = newValue.replace(/\W/g, '');
        this.setState({ inputValue });
        return inputValue;
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
                        <hr/>
                        <AsyncSelect
                            cacheOptions
                            loadOptions={loadOptions}
                            defaultOptions
                            onInputChange={this.handleInputChange}
                        />
                        <Dropdown
                            fluid
                            selection
                            multiple={false}
                            search={true}
                            options={this.state.options}
                            value={this.state.value}
                            placeholder='Add Users'
                            onChange={this.handleChange}
                            onSearchChange={this.handleSearchChange}
                            disabled={this.state.isFetching}
                            loading={this.state.isFetching}
                        />
                        <hr/>
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
