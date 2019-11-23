import React from 'react';
import {dateFormatter, phoneFormatter, typeMasterFormatter, typeMasterWorkingDayFormatter} from "../data/formatter";

function type(cell) {
    return (
        <span>{typeMasterFormatter(cell)}</span>
    );
}

function workingDay(cell) {
    return (
        <span>{typeMasterWorkingDayFormatter(cell)}</span>
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