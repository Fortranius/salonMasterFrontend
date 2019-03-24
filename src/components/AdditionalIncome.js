import React, {Component} from 'react';
import '../App.css';
import TableRemote from "./remote/TableRemote";
import {connect} from 'react-redux';
import {getAdditionalIncomesAction} from "../actions/additionalIncomeActions"
import {bindActionCreators} from 'redux'
import PageParams from '../model/PageParams'
import AdditionalIncomeModal from "../modal/AdditionalIncomeModal";
import {getAllMasters} from "../service/masterService";
import {selectFilter} from "react-bootstrap-table2-filter";
import moment from 'moment'
import DayPickerInput from 'react-day-picker/DayPickerInput';
import MomentLocaleUtils, {formatDate, parseDate,} from 'react-day-picker/moment';
import {getAdditionalIncomingReport} from "../service/reportService";

class AdditionalIncome extends Component {

    constructor(props) {
        super(props);
        this.state = {
            openUpdate: false,
            openCreate: false,
            sortField: '',
            sortOrder: '',
            masterOptions: {},
            filters: {},
            row: undefined,
            error: undefined,
            start: moment().startOf('month').toDate(),
            end: moment().endOf('month').toDate()
        };
        this.handleTableChange = this.handleTableChange.bind(this);

        this.onOpenUpdateModal = this.onOpenUpdateModal.bind(this);
        this.onCloseUpdateModal = this.onCloseUpdateModal.bind(this);

        this.onOpenCreateModal = this.onOpenCreateModal.bind(this);
        this.onCloseCreateModal = this.onCloseCreateModal.bind(this);

        this.accept = this.accept.bind(this);
        this.export = this.export.bind(this);

        this.props.additionalIncomesActions(new PageParams(0, 10, "date", "asc"),
            moment(new Date(this.state.start)).format('YYYY-MM-DD HH:mm:ss'),
            moment(new Date(this.state.end)).format('YYYY-MM-DD HH:mm:ss'));

        getAllMasters().then(masters => {
            let masterOptions = {};
            masters.forEach(master => {
                masterOptions[master.id] = master.person.name;
            });
            this.setState({
                masterOptions: masterOptions
            })
        });
    }

    onOpenUpdateModal (row) {
        this.setState({
            openUpdate: true,
            row: row,
            error: undefined
        });
    };

    onOpenCreateModal () {
        this.setState({
            openCreate: true,
            error: undefined
        });
    };

    onCloseUpdateModal = () => {
        this.setState({
            openUpdate: false,
            row: undefined,
            error: undefined
        });
    };

    onCloseCreateModal = () => {
        this.setState({
            openCreate: false,
            error: undefined
        });
    };

    handleTableChange = (type, {sortField, sortOrder, filters, page, sizePerPage}) => {
        this.setState({
            sortField: sortField,
            sortOrder: sortOrder,
            filters: filters
        });
        this.props.additionalIncomesActions(new PageParams(page - 1, sizePerPage, sortField, sortOrder, filters),
            moment(new Date(this.state.start)).format('YYYY-MM-DD HH:mm:ss'),
            moment(new Date(this.state.end)).format('YYYY-MM-DD HH:mm:ss'));
    };

    accept() {
        this.props.additionalIncomesActions(new PageParams(
            this.props.incomes.number,
            this.props.incomes.size,
            this.state.sortField,
            this.state.sortOrder,
            this.state.filters),
            moment(new Date(this.state.start)).format('YYYY-MM-DD HH:mm:ss'),
            moment(new Date(this.state.end)).format('YYYY-MM-DD HH:mm:ss'));
        this.setState({
            openUpdate: false,
            openCreate: false,
            row: undefined,
            error: undefined
        });
    };

    handleChangeStartDate = (newValue) => {
        this.props.additionalIncomesActions(new PageParams(
            this.props.incomes.number,
            this.props.incomes.size,
            this.state.sortField,
            this.state.sortOrder,
            this.state.filters),
            moment(new Date(newValue)).format('YYYY-MM-DD HH:mm:ss'),
            moment(new Date(this.state.end)).format('YYYY-MM-DD HH:mm:ss'));
        this.setState({
            start: newValue
        });
    };

    handleChangeEndDate = (newValue) => {
        this.props.additionalIncomesActions(new PageParams(
            this.props.incomes.number,
            this.props.incomes.size,
            this.state.sortField,
            this.state.sortOrder,
            this.state.filters),
            moment(new Date(this.state.start)).format('YYYY-MM-DD HH:mm:ss'),
            moment(new Date(newValue)).format('YYYY-MM-DD HH:mm:ss'));
        this.setState({
            end: newValue
        });
    };

    export() {
        getAdditionalIncomingReport(new PageParams(
            this.props.incomes.number,
            this.props.incomes.size,
            this.state.sortField,
            this.state.sortOrder,
            this.state.filters),
            moment(new Date(this.state.start)).format('YYYY-MM-DD HH:mm:ss'),
            moment(new Date(this.state.end)).format('YYYY-MM-DD HH:mm:ss'));
    }

    render() {
        const colAdditionalIncome = [
            {
                dataField: 'date',
                text: 'Дата',
                sort: true,
                formatter: (cellContent) => {
                    return (
                        <div>
                            {moment.unix(cellContent).format("DD.MM.YYYY")}
                        </div>
                    )
                }
            },{
                dataField: 'master.person.name',
                text: '',
                sort: true,
                filter: selectFilter({
                    placeholder: 'Мастер',
                    style: {
                        backgroundColor: '#e4e4e1'
                    },
                    options: this.state.masterOptions
                })
            },
            {
                dataField: 'sum',
                text: 'Сумма'
            }
        ];
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
                                formatDate={formatDate}
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
                                formatDate={formatDate}
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
                <TableRemote data={this.props.incomes ? this.props.incomes.content : []}
                                                   page={this.props.incomes ? this.props.incomes.number + 1 : 1}
                                                   columns={colAdditionalIncome}
                                                   entity="заработок"
                                                   buttonCreateTitle='Создание новой записи'
                                                   buttonEditTitle='Изменение записи'
                                                   sizePerPage={this.props.incomes ? this.props.incomes.size : 0}
                                                   update={this.onOpenUpdateModal}
                                                   create={this.onOpenCreateModal}
                                                   isExport={true}
                                                   export={this.export}
                                                   totalSize={this.props.incomes ? this.props.incomes.totalElements : 0}
                                                   onTableChange={this.handleTableChange}/>

                {this.state.row ? <AdditionalIncomeModal accept={this.accept}
                             open={this.state.openUpdate}
                             isCreate={false}
                             update={this.state.row}
                             close={this.onCloseUpdateModal} />: null}

                <AdditionalIncomeModal accept={this.accept}
                             open={this.state.openCreate} isCreate={true}
                             close={this.onCloseCreateModal} />
            </div>
        );
    }
}

const mapStateToProps = state => ({
    incomes: state.additionalIncomeReducer.incomes
});

function mapDispatchToProps(dispatch) {
    return {
        additionalIncomesActions: bindActionCreators(getAdditionalIncomesAction, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AdditionalIncome);
