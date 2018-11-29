import { textFilter } from 'react-bootstrap-table2-filter';


export default [
    {
        dataField: 'id',
        text: 'ID',
        filter: textFilter(),
        sort: true
    },
    {
        dataField: 'name',
        text: 'Имя',
        filter: textFilter(),
        sort: true
    },
    {
        dataField: 'surname',
        text: 'Фамилия',
        filter: textFilter(),
        sort: true
    },
    {
        dataField: 'midname',
        text: 'Отчество',
        filter: textFilter(),
        sort: true
    },
    {
        dataField: 'phone',
        text: 'Телефон',
        filter: textFilter(),
        sort: true
    },
    {
        dataField: 'mail',
        text: 'Почта',
        filter: textFilter(),
        sort: true
    }
]