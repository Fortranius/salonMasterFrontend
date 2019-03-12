import {typeHairFormatter, typeMasterFormatter} from "../data/formatter";

import React from "react";

function typeMaster(cell) {
    return (
        <span>{typeMasterFormatter(cell)}</span>
    );
}

function typeHair(cell) {
    return (
        <span>{typeHairFormatter(cell)}</span>
    );
}

export default [
    {
        dataField: 'price',
        text: 'Стоимсоть за прядь'
    },
    {
        dataField: 'masterType',
        text: 'Категория мастера',
        formatter: typeMaster
    },
    {
        dataField: 'hairType',
        text: 'Тип работ',
        formatter: typeHair
    }
]