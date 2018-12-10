export function getClients(params) {
    return fetch("http://localhost:8080/api/clients?page=" + params.page + "&size=" + params.size)
        .then(handleErrors)
        .then(res => res.json())
        .then(val => {
            return val;
        });
}

export function getClientsByFilter(filter) {
    return fetch("http://localhost:8080/api/clients/name?filter=" + filter + "&size=100")
        .then(handleErrors)
        .then(res => res.json())
        .then(val => {
            return val;
        });
}

export function getClientsByPhone(filter) {
    return fetch("http://localhost:8080/api/clients/phone/" + filter + "?size=100")
        .then(handleErrors)
        .then(res => res.json())
        .then(val => {
            return val;
        });
}

export function removeClient(clientId) {
    return fetch("http://localhost:8080/api/client/" + clientId, {method: "DELETE"})
        .then(handleErrors)
        .then(function(res){ return res })
}

export function updateClient(master) {
    return sendRequest(master, "PUT");
}

export function createClient(master) {
    return sendRequest(master, "POST");
}

function sendRequest(master, method) {

    const options = {
        method: method,
        headers: new Headers({'content-type': 'application/json'}),
        body: JSON.stringify(master)
    };

    return fetch("http://localhost:8080/api/client", options)
        .then(handleErrors)
        .then(function(res){ return res })
}

function handleErrors(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}