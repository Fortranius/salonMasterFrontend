import { textFilter } from 'react-bootstrap-table2-filter';


export default [
    {
        dataField: 'id',
        text: 'ID',
        filter: textFilter(),
        sort: true
    },
    {
        dataField: 'person.firstname',
        text: 'Имя',
        filter: textFilter(),
        sort: true
    },
    {
        dataField: 'person.lastname',
        text: 'Фамилия',
        filter: textFilter(),
        sort: true
    },
    {
        dataField: 'person.midname',
        text: 'Отчество',
        filter: textFilter(),
        sort: true
    },
    {
        dataField: 'person.phone',
        text: 'Телефон',
        filter: textFilter(),
        sort: true
    },
    {
        dataField: 'person.mail',
        text: 'Почта',
        filter: textFilter(),
        sort: true
    }
]