import React from "react";
import moment from 'moment'

function dateFormatter(cell) {
    return (
        <span>{moment.unix(cell).toDate().toLocaleDateString()}</span>
    );
}

export default [
    {
        dataField: 'date',
        text: 'Дата',
        formatter: dateFormatter
    },
    {
        dataField: 'change',
        text: 'Изменение'
    }
]