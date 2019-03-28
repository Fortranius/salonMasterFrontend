export function getSales(params) {
    return fetch("http://localhost:8080/api/sales?page=" + params.page
        + "&size=" + params.size)
        .then(handleErrors)
        .then(res => res.json())
        .then(val => {
            return val;
        });
}

export function updateSale(entity) {
    return sendRequest(entity, "PUT");
}

export function createSale(entity) {
    return sendRequest(entity, "POST");
}

function sendRequest(entity, method) {

    const options = {
        method: method,
        headers: new Headers({'content-type': 'application/json'}),
        body: JSON.stringify(entity)
    };

    return fetch("http://localhost:8080/api/sale", options)
        .then(function(res){ return res })
}

function handleErrors(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}