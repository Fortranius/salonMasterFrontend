export function getProcedures() {
    return fetch("http://localhost:8080/api/procedures")
        .then(handleErrors)
        .then(res => res.json())
        .then(val => {
            return val;
        });
}

export function createProcedure(entity) {
    return sendRequest(entity, "POST");
}

export function updateProcedure(entity) {
    return sendRequest(entity, "PUT");
}

function sendRequest(entity, method) {

    const options = {
        method: method,
        headers: new Headers({'content-type': 'application/json'}),
        body: JSON.stringify(entity)
    };

    return fetch("http://localhost:8080/api/procedure", options)
        .then(handleErrors)
        .then(function(res){ return res })
}

function handleErrors(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}