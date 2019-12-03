import React, {Component} from 'react';
import '../App.css';
import '../style.css';
import MomentLocaleUtils, {formatDate, parseDate,} from 'react-day-picker/moment';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import moment from "moment/moment";
import {getMastersReport} from "../service/reportService";
import {getMasters, getMastersByFiO} from "../service/masterService";
import AsyncPaginate from 'react-select-async-paginate';
import PageParams from "../model/PageParams";
import {getStatisticMastersReport} from "../service/dashboardService";
import ReactTable from 'react-table'
import {reportOptions} from "../data/selectOptions";
import Select from 'react-select';

async function getOptionMastersByFIO(search, loadedOptions) {
    let response;
    if (!search) response = await getMasters(new PageParams(0, 100));
    else response = await getMastersByFiO(search);
    let cachedOptions = response.content.map((d) => ({
        value: d.id,
        label: d.person.name,
        master: d
    }));
    return {
        options: cachedOptions,
        hasMore: true
    };
}

class Dashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            masters: undefined,
            all: undefined,
            start: moment().startOf('month').toDate(),
            end: moment().endOf('month').toDate(),
            selectMasterFio: undefined,
            data: [],
            columns: [{
                dataField: 'day',
                text: 'Дата'
            }],
            pageSize: 30,
            reportType: undefined,
            report: 0
        };
        this.handleChangeStartDate = this.handleChangeStartDate.bind(this);
        this.handleChangeEndDate = this.handleChangeEndDate.bind(this);

        getStatisticMastersReport(moment(new Date(this.state.start)).format('YYYY-MM-DD HH:mm:ss'),
            moment(new Date(this.state.end)).format('YYYY-MM-DD HH:mm:ss'), this.state.report).then(data => {
            this.setState({
                columns: data.columns,
                data: data.data,
                pageSize: data.data.length + 1
            });
        });
    }

    handleChangeStartDate = (newValue) => {
        getStatisticMastersReport(moment(new Date(newValue)).format('YYYY-MM-DD HH:mm:ss'),
            moment(new Date(this.state.end)).format('YYYY-MM-DD HH:mm:ss'), this.state.report).then(data => {
            this.setState({
                columns: data.columns,
                data: data.data,
                start: newValue,
                pageSize: data.data.length + 1
            });
        });
    };

    handleChangeEndDate = (newValue) => {
        getStatisticMastersReport(moment(new Date(this.state.start)).format('YYYY-MM-DD HH:mm:ss'),
            moment(new Date(newValue)).set({hour:23,minute:59,second:59,millisecond:0}).format('YYYY-MM-DD HH:mm:ss'),
            this.state.report).then(data => {
            this.setState({
                columns: data.columns,
                data: data.data,
                end: newValue,
                pageSize: data.data.length + 1
            });
        });
    };

    export = () => {
        getMastersReport(moment(new Date(this.state.start)).format('YYYY-MM-DD HH:mm:ss'),
            moment(new Date(this.state.end)).format('YYYY-MM-DD HH:mm:ss'));
    };

    handleInputMasterChange = (newValue) => {
        getStatisticMastersReport(moment(new Date(this.state.start)).format('YYYY-MM-DD HH:mm:ss'),
            moment(new Date(this.state.end)).format('YYYY-MM-DD HH:mm:ss'), this.state.report, newValue.master).then(data => {
            this.setState({
                columns: data.columns,
                data: data.data,
                pageSize: data.data.length + 1,
                selectMaster: newValue.master,
                selectMasterFio: {
                    value: newValue.value,
                    label: newValue.master.person.name,
                    master: newValue.master
                }
            });
        });
    };

    handleChangeReport = (newValue) => {
        getStatisticMastersReport(moment(new Date(this.state.start)).format('YYYY-MM-DD HH:mm:ss'),
            moment(new Date(this.state.end)).format('YYYY-MM-DD HH:mm:ss'), newValue.value, this.state.selectMaster).then(data => {
            this.setState({
                columns: data.columns,
                data: data.data,
                pageSize: data.data.length + 1,
                reportType: newValue,
                report: newValue.value
            });
        });
    };

    render() {
        return (
            <div className="main-div">
                <div className="container" >
                    <div className="row">
                        <div className="col-sm-1 title-margin-date">
                            c
                        </div>
                        <div className="col-sm">
                            <DayPickerInput
                                placeholder={``}
                                parseDate={parseDate}
                                formatDate={formatDate}
                                value={this.state.start}
                                onDayChange={this.handleChangeStartDate}
                                dayPickerProps={{
                                    locale: 'ru',
                                    localeUtils: MomentLocaleUtils
                                }}
                            />
                        </div>
                        <div className="col-sm-1 title-margin-date">
                            по
                        </div>
                        <div className="col-sm">
                            <DayPickerInput
                                placeholder={``}
                                parseDate={parseDate}
                                formatDate={formatDate}
                                value={this.state.end}
                                onDayChange={this.handleChangeEndDate}
                                dayPickerProps={{
                                    locale: 'ru',
                                    localeUtils: MomentLocaleUtils
                                }}
                            />
                        </div>

                        <div className="col-sm-1 title-margin-date">
                            Мастер:
                        </div>
                        <div className="col-sm">
                            <AsyncPaginate
                                value={this.state.selectMasterFio}
                                loadOptions={getOptionMastersByFIO}
                                onChange={this.handleInputMasterChange}
                                placeholder={'Выберите мастера'}
                            />
                        </div>
                    </div>
                </div>
                <hr/>
                <div>
                    <div className="container" >
                        <div className="row">
                            <div className="col-sm-3 title-margin-date">
                                <button onClick = { this.export } className="btn btn-primary">
                                    Выгрузить сводный отчет
                                </button>
                            </div>
                            <div className="col-sm-1  title-margin-date">
                                Отчет:
                            </div>
                            <div className="col-sm-4">
                                <Select
                                    value={this.state.reportType}
                                    options={reportOptions()}
                                    placeholder={''}
                                    onChange={this.handleChangeReport}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <hr/>
                <div>
                    <ReactTable
                        data={this.state.data}
                        columns={this.state.columns}
                        showPagination={false}
                        pageSize={this.state.pageSize}
                    />
                </div>
            </div>
        );
    }
}

export default Dashboard;
