export function getServices() {
    return fetch("http://localhost:8080/api/services")
        .then(handleErrors)
        .then(res => res.json())
        .then(val => {
            return val;
        });
}

export function getServicesByDescription(description) {
    return fetch("http://localhost:8080/api/services/description/" + description)
        .then(handleErrors)
        .then(res => res.json())
        .then(val => {
            return val;
        });
}

export function createService(service) {
    return sendRequest(service, "POST");
}

export function updateService(service) {
    return sendRequest(service, "PUT");
}

function sendRequest(master, method) {

    const options = {
        method: method,
        headers: new Headers({'content-type': 'application/json'}),
        body: JSON.stringify(master)
    };

    return fetch("http://localhost:8080/api/service", options)
        .then(handleErrors)
        .then(function(res){ return res })
}

function handleErrors(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}