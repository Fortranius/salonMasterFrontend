import React from 'react';
import {typeMasterFormatter, typeMAsterWorkingDayFormatter} from "../data/formatter";
import moment from 'moment'

function phoneFormatter(cell, row) {
    if (row.person.phone) {
        let phone = '+7 (' + row.person.phone.substring(0,3) + ') '
            + row.person.phone.substring(3, 6) + '-'
            + row.person.phone.substring(6, 8) + '-'
            + row.person.phone.substring(8, 10);
        return (
            <span>
                {phone}
            </span>
        );
    }

    return (
        <span>$ { cell } NTD</span>
    );
}

function type(cell) {
    return (
        <span>{typeMasterFormatter(cell)}</span>
    );
}

function workingDay(cell) {
    return (
        <span>{typeMAsterWorkingDayFormatter(cell)}</span>
    );
}

function dateFormatter(cell) {
    return (
        <span>{moment.unix(cell).toDate().toLocaleDateString()}</span>
    );
}

export default [
    {
        dataField: 'person.name',
        text: 'Имя'
    },
    {
        dataField: 'person.phone',
        text: 'Телефон',
        formatter: phoneFormatter
    },
    {
        dataField: 'person.mail',
        text: 'Почта'
    },
    {
        dataField: 'type',
        text: 'Категория',
        formatter: type
    },
    {
        dataField: 'startDateWork',
        text: 'Дата начала работы',
        formatter: dateFormatter
    },
    {
        dataField: 'workingDay',
        text: 'График',
        formatter: workingDay
    }
]