import React from 'react';
import typeFormatter from "../data/typeMaster";

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
        <span>{typeFormatter(cell)}</span>
    );
}

export default [
    {
        dataField: 'id',
        text: 'ID'
    },
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
    }
]