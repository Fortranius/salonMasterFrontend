import moment from 'moment'
import React from 'react';
import NumberFormat from "react-number-format";

export function typeMasterFormatter(cell) {
    switch (cell) {
        case 'TOP_LEADER':
            return "Руководитель Топ мастер";
        case 'TOP':
            return "Топ мастер";
        case 'MIDDLE_PLUS':
            return "Стандарт плюс мастер";
        case 'MIDDLE':
            return "Стандартный мастер";
        case 'START':
            return "Начинающий мастер";
        case 'SUPPORT':
            return "Помощник";
        case 'TOP_COLORIST':
            return "Топ колорист";
        case 'COLORIST':
            return "Колорист";
        case 'CARE_MASTER':
            return "Мастер по уходовым процедурам";
        default:
            return "";
    }
}

export function typeHairFormatter(cell) {
    switch (cell) {
        case 'HAIR_EXTENSION':
            return "Наращивание волос";
        case 'HAIR_REMOVAL':
            return "Снятие волос";
        default:
            return "";
    }
}

export function typeMasterWorkingDayFormatter(cell) {
    switch (cell) {
        case '$2X2':
            return "2 на 2";
        case '$5X2':
            return "5 на 2";
        case '$4X2':
            return "4 на 2";
        default:
            return "";
    }
}

export function phoneFormatter(cell, row) {
    if (row.person.phone) {
        return (
            <span>
                {phoneFormatterToString(row.person.phone)}
            </span>
        );
    }

    return (
        <span>$ { cell } NTD</span>
    );
}

export function phoneFormatterToString(phone) {
    return '+' + phone.substring(0,1)+' ('
        + phone.substring(1,4) + ') '
        + phone.substring(4, 7) + '-'
        + phone.substring(7, 9) + '-'
        + phone.substring(9, 11);
}

export function dateFormatter(cell) {
    return (
        <span>{moment.unix(cell).toDate().toLocaleDateString()}</span>
    );
}

export function NumberFormatCustomPhone(props) {
    const { inputRef, onChange, ...other } = props;

    return (
        <NumberFormat
            {...other}
            getInputRef={inputRef}
            format="+# (###) ###-####" mask="_"
            onValueChange={values => {
                onChange({
                    target: {
                        value: values.value,
                    },
                });
            }}
            thousandSeparator
            prefix="$"
        />
    );
}

