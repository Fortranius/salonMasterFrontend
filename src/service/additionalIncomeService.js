import {getUrl} from "./mainUrl";

export function getAdditionalIncomes(params, start, end) {
    let sort = params.sortField ? "&sort=" + params.sortField +  ',' + params.sortOrder : '';
    let filterMaster= params.filters && params.filters['master.person.name'] ? "&masterId=" + params.filters['master.person.name'].filterVal : '';
    return fetch(getUrl() + "/api/additionalIncomes?page=" + params.page
        + "&size=" + params.size + sort + filterMaster + "&start=" + start + "&end=" + end)
        .then(handleErrors)
        .then(res => res.json())
        .then(val => {
            return val;
        });
}

export function updateAdditionalIncome(entity) {
    return sendRequest(entity, "PUT");
}

export function createAdditionalIncome(entity) {
    return sendRequest(entity, "POST");
}

function sendRequest(entity, method) {

    const options = {
        method: method,
        headers: new Headers({'content-type': 'application/json'}),
        body: JSON.stringify(entity)
    };

    return fetch(getUrl() + "/api/additionalIncome", options)
        .then(function(res){ return res })
}

function handleErrors(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}