import {phoneFormatter} from "../data/formatter";

export default [
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