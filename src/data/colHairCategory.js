import typeFormatter from "./typeMaster";
import React from "react";

function type(cell) {
    return (
        <span>{typeFormatter(cell)}</span>
    );
}

export default [
    {
        dataField: 'price',
        text: 'Стоимсоть за прядь'
    },
    {
        dataField: 'type',
        text: 'Категория мастера',
        formatter: type
    }
]