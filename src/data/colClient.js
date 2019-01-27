import React from 'react';

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

export default [
    {
        dataField: 'id',
        text: 'ID',
        sort: true
    },
    {
        dataField: 'person.name',
        text: 'Имя',
        sort: true
    },
    {
        dataField: 'person.phone',
        text: 'Телефон',
        sort: true,
        formatter: phoneFormatter
    },
    {
        dataField: 'person.mail',
        text: 'Почта',
        sort: true
    },
    {
        dataField: 'description',
        text: 'Описание',
        sort: true
    }
]