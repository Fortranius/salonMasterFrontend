import {getUrl} from "./mainUrl";

export function getClients(params) {
    return fetch(getUrl() + "/api/clients?page=" + params.page + "&size=" + params.size)
        .then(handleErrors)
        .then(res => res.json())
        .then(val => {
            return val;
        });
}

export function getClientsByFiO(name) {
    return fetch(getUrl() + "/api/clients/name/" + name)
        .then(handleErrors)
        .then(res => res.json())
        .then(val => {
            return val;
        });
}

export function getClientsByPhone(filter) {
    return fetch(getUrl() + "/api/clients/phone/" + filter)
        .then(handleErrors)
        .then(res => res.json())
        .then(val => {
            return val;
        });
}

export function removeClient(clientId) {
    return fetch(getUrl() + "/api/client/" + clientId, {method: "DELETE"})
        .then(handleErrors)
        .then(function(res){ return res })
}

export function updateClient(entity) {
    return sendRequest(entity, "PUT");
}

export function createClient(entity) {
    return sendRequest(entity, "POST");
}

function sendRequest(entity, method) {

    const options = {
        method: method,
        headers: new Headers({'content-type': 'application/json'}),
        body: JSON.stringify(entity)
    };

    return fetch(getUrl() + "/api/client", options)
        .then(handleErrors)
        .then(function(res){ return res })
}

function handleErrors(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}