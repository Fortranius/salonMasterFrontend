import React from "react";

function  maxLength(cell) {
    let max = cell !== 0 ? cell : "более";
    return (
        <span>{max}</span>
    );
}

export default [
    {
        dataField: 'minLength',
        text: 'Минимальная длина'
    },
    {
        dataField: 'maxLength',
        text: 'Максимальная длина',
        formatter: maxLength
    },
    {
        dataField: 'price',
        text: 'Стоимость за грамм'
    }
]