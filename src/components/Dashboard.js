import React, {Component} from 'react';
import '../App.css';
import '../style.css';
import {Bar, Pie} from 'react-chartjs-2';
import {getDashboardAll, getDashboardMasters} from "../service/dashboardService";
import MomentLocaleUtils, {parseDate} from "react-day-picker/moment";
import DayPickerInput from 'react-day-picker/DayPickerInput';
import moment from "moment/moment";

class Dashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            masters: undefined,
            all: undefined,
            start: moment().startOf('week').isoWeekday(1).toDate(),
            end: moment().startOf('week').isoWeekday(7).toDate()
        };
        this.handleChangeStartDate = this.handleChangeStartDate.bind(this);
        this.handleChangeEndDate = this.handleChangeEndDate.bind(this);
        this.getDashboardAll(
            moment(moment().startOf('week').isoWeekday(1).toDate()).format('YYYY-MM-DD HH:mm:ss'),
            moment(moment().startOf('week').isoWeekday(7).toDate()).format('YYYY-MM-DD HH:mm:ss'));
        this.getDashboardMasters(
            moment(moment().startOf('week').isoWeekday(1).toDate()).format('YYYY-MM-DD HH:mm:ss'),
            moment(moment().startOf('week').isoWeekday(7).toDate()).format('YYYY-MM-DD HH:mm:ss'));
    }

    getDashboardMasters(start, end) {
        getDashboardMasters(start, end).then(data => {
            let labels = [];
            let incomes = [];
            let costs = [];
            data.forEach(masterPerformance => {
                labels.push(masterPerformance.master.person.name);
                costs.push(masterPerformance.cost);
                incomes.push(masterPerformance.income);
            });
            this.setState({
                masters: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Доходы',
                            backgroundColor: '#FF6384',
                            borderColor: '#FF6384',
                            borderWidth: 1,
                            hoverBackgroundColor: '#FF6384',
                            hoverBorderColor: '#FF6384',
                            data: incomes
                        },
                        {
                            label: 'Расходы',
                            backgroundColor: '#36A2EB',
                            borderColor: '#36A2EB',
                            borderWidth: 1,
                            hoverBackgroundColor: '#36A2EB',
                            hoverBorderColor: '#36A2EB',
                            data: costs
                        }
                    ]
                }
            });
        });
    }

    getDashboardAll(start, end) {
        getDashboardAll(start, end).then(data => {
            this.setState({
                all: {
                    labels: [
                        'Доходы',
                        'Расходы',
                    ],
                    datasets: [{
                        data: [data.income,data.cost],
                        backgroundColor: [
                            '#FF6384',
                            '#36A2EB'
                        ],
                        hoverBackgroundColor: [
                            '#FF6384',
                            '#36A2EB'
                        ]
                    }]
                }
            });
        });
    }

    handleChangeStartDate = (newValue) => {
        this.getDashboardMasters(
            moment(new Date(newValue)).format('YYYY-MM-DD HH:mm:ss'),
            moment(new Date(this.state.end)).format('YYYY-MM-DD HH:mm:ss'));
        this.getDashboardAll(
            moment(new Date(newValue)).format('YYYY-MM-DD HH:mm:ss'),
            moment(new Date(this.state.end)).format('YYYY-MM-DD HH:mm:ss'));
        this.setState({
            start: newValue
        });
    };

    handleChangeEndDate = (newValue) => {
        this.getDashboardMasters(
            moment(new Date(this.state.start)).format('YYYY-MM-DD HH:mm:ss'),
            moment(new Date(newValue)).format('YYYY-MM-DD HH:mm:ss'));
        this.getDashboardAll(
            moment(new Date(this.state.start)).format('YYYY-MM-DD HH:mm:ss'),
            moment(new Date(newValue)).format('YYYY-MM-DD HH:mm:ss'));
        this.setState({
            end: newValue
        });
    };

    render() {
        return (
            <div className="main-div">
                <div className="container" >
                    <div className="row">
                        <div className="col-sm-2 title-margin-date">
                            c
                        </div>
                        <div className="col-sm">
                            <DayPickerInput
                                placeholder={``}
                                parseDate={parseDate}
                                value={this.state.start}
                                onDayChange={this.handleChangeStartDate}
                                dayPickerProps={{
                                    locale: 'ru',
                                    localeUtils: MomentLocaleUtils
                                }}
                            />
                        </div>
                        <div className="col-sm-2 title-margin-date">
                            по
                        </div>
                        <div className="col-sm">
                            <DayPickerInput
                                placeholder={``}
                                parseDate={parseDate}
                                value={this.state.end}
                                onDayChange={this.handleChangeEndDate}
                                dayPickerProps={{
                                    locale: 'ru',
                                    localeUtils: MomentLocaleUtils
                                }}
                            />
                        </div>
                    </div>
                </div>
                <hr/>
                {this.state.masters ? <div>
                    <h2>Доходы и расходы мастеров</h2>
                    <Bar
                        data={this.state.masters}
                        width={50}
                        height={50}
                        options={{
                            maintainAspectRatio: false
                        }}
                    />
                    <hr/>
                </div> : null}
                {this.state.all ? <div>
                    <h2>Общие доходы и расходы</h2>
                    <Pie data={this.state.all} height={50} />
                    <hr/>
                </div> : null}
            </div>
        );
    }
}

export default Dashboard;
