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
import BootstrapTable from 'react-bootstrap-table-next';

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
            }]
        };
        this.handleChangeStartDate = this.handleChangeStartDate.bind(this);
        this.handleChangeEndDate = this.handleChangeEndDate.bind(this);

        getStatisticMastersReport(moment(new Date(this.state.start)).format('YYYY-MM-DD HH:mm:ss'),
            moment(new Date(this.state.end)).format('YYYY-MM-DD HH:mm:ss')).then(data => {
            console.log(data);

            let columns = [
                    {
                        dataField: 'day',
                        text: 'Дата'
                    },{
                        dataField: 'master1000.product10001000',
                        text: 'Дата'
                    }
                ];

            this.setState({
                columns: columns,
                data: data
            });
        });
    }

    handleChangeStartDate = (newValue) => {
        this.setState({
            start: newValue
        });
    };

    handleChangeEndDate = (newValue) => {
        this.setState({
            end: newValue
        });
    };

    export = () => {
        getMastersReport(moment(new Date(this.state.start)).format('YYYY-MM-DD HH:mm:ss'),
            moment(new Date(this.state.end)).format('YYYY-MM-DD HH:mm:ss'));
    };

    handleInputMasterChange = (newValue) => {
        this.setState({
            selectMaster: newValue.master,
            selectMasterFio: {
                value: newValue.value,
                label: newValue.master.person.name,
                master: newValue.master
            }
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
                    <button onClick = { this.export } className="btn btn-primary">
                        Выгрузить сводный отчет
                    </button>
                </div>
                <hr/>
                <div>
                    <BootstrapTable
                        keyField="day"
                        data={this.state.data}
                        columns={this.state.columns}
                    />
                </div>
            </div>
        );
    }
}

export default Dashboard;
