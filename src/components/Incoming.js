import React, {Component} from 'react';
import '../App.css';
import TableRemote from "./remote/TableRemote";
import {connect} from 'react-redux';
import {getIncomingAction} from "../actions/incomingActions"
import {bindActionCreators} from 'redux'
import PageParams from '../model/PageParams'
import IncomingModal from "../modal/IncomingModal";
import {selectFilter} from "react-bootstrap-table2-filter";
import {getProducts} from "../service/productService";
import moment from 'moment'
import DayPickerInput from 'react-day-picker/DayPickerInput';
import MomentLocaleUtils, {formatDate, parseDate,} from 'react-day-picker/moment';
import {getIncomingReport} from "../service/reportService";

class Incoming extends Component {

    constructor(props) {
        super(props);
        this.state = {
            openUpdate: false,
            openCreate: false,
            sortField: '',
            sortOrder: '',
            productOptions: {},
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

        this.props.incomingActions(new PageParams(0, 10, "date", "asc"),
            moment(new Date(this.state.start)).format('YYYY-MM-DD HH:mm:ss'),
            moment(new Date(this.state.end)).format('YYYY-MM-DD HH:mm:ss'));

        getProducts().then(products => {
            let productOptions = {};
            products.forEach(product => {
                productOptions[product.id] = product.description;
            });
            this.setState({
                productOptions: productOptions
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
        this.props.incomingActions(new PageParams(page - 1, sizePerPage, sortField, sortOrder, filters),
            moment(new Date(this.state.start)).format('YYYY-MM-DD HH:mm:ss'),
            moment(new Date(this.state.end)).format('YYYY-MM-DD HH:mm:ss'));
    };

    accept() {
        this.props.incomingActions(new PageParams(
            this.props.incoming.number,
            this.props.incoming.size,
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
        this.props.incomingActions(new PageParams(
            this.props.incoming.number,
            this.props.incoming.size,
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
        this.props.expenseActions(new PageParams(
            this.props.incoming.number,
            this.props.incoming.size,
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
        getIncomingReport(new PageParams(
            this.props.incoming.number,
            this.props.incoming.size,
            this.state.sortField,
            this.state.sortOrder,
            this.state.filters),
            moment(new Date(this.state.start)).format('YYYY-MM-DD HH:mm:ss'),
            moment(new Date(this.state.end)).format('YYYY-MM-DD HH:mm:ss'));
    }

    render() {
        const colIncoming = [
            {
                dataField: 'date',
                text: 'Дата прихода',
                sort: true,
                formatter: (cellContent) => {
                    return (
                        <div>
                            {moment.unix(cellContent).format("DD.MM.YYYY")}
                        </div>
                    )
                }
            },
            {
                dataField: 'product.description',
                text: '',
                sort: true,
                filter: selectFilter({
                    placeholder: 'Товар',
                    style: {
                        backgroundColor: '#e4e4e1'
                    },
                    options: this.state.productOptions
                })
            },
            {
                dataField: 'countProduct',
                text: 'Количество товара'
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
                <TableRemote data={this.props.incoming ? this.props.incoming.content : []}
                                                   page={this.props.incoming ? this.props.incoming.number + 1 : 1}
                                                   columns={colIncoming}
                                                   entity="приход"
                                                   buttonCreateTitle='Создание нового прихода'
                                                   buttonEditTitle='Изменение прихода'
                                                   sizePerPage={this.props.incoming ? this.props.incoming.size : 0}
                                                   update={this.onOpenUpdateModal}
                                                   create={this.onOpenCreateModal}
                                                   isExport={true}
                                                   export={this.export}
                                                   totalSize={this.props.incoming ? this.props.incoming.totalElements : 0}
                                                   onTableChange={this.handleTableChange}/>

                {this.state.row ? <IncomingModal accept={this.accept}
                             open={this.state.openUpdate}
                             isCreate={false}
                             update={this.state.row}
                             close={this.onCloseUpdateModal} />: null}

                <IncomingModal accept={this.accept}
                             open={this.state.openCreate} isCreate={true}
                             close={this.onCloseCreateModal} />
            </div>
        );
    }
}

const mapStateToProps = state => ({
    incoming: state.incomingReducer.incoming
});

function mapDispatchToProps(dispatch) {
    return {
        incomingActions: bindActionCreators(getIncomingAction, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Incoming);
