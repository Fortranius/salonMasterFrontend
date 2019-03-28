import React from "react";
import moment from 'moment'

function priceFormatter(cell) {
    return (
        <span>{cell.toLocaleString()} руб.</span>
    );
}

function dateFormatter(cell) {
    return (
        <span>{moment.unix(cell).toDate().toLocaleDateString()}</span>
    );
}

function statusFormatter(cell) {
    let status ='';
    if (cell === 'NEW') status = 'Ожидание клиента';
    if (cell === 'DONE') status = 'Клиент пришел';
    if (cell === 'CANCELED') status = 'Клиент не пришел';
    if (cell === 'READY') status = 'Клиент подтвердил';
    return (
        <span>{status}</span>
    );
}

export default [
    {
        dataField: 'master.person.name',
        text: 'Мастер'
    },
    {
        dataField: 'allPrice',
        text: 'Сумма',
        formatter: priceFormatter
    },
    {
        dataField: 'startSlot',
        text: 'Дата',
        formatter: dateFormatter
    },
    {
        dataField: 'status',
        text: 'Статус заказа',
        formatter: statusFormatter
    }
]