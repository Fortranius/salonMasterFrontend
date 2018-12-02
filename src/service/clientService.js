export function getClients(params) {
    return fetch("http://localhost:8080/api/clients?page=" + params.page + "&size=" + params.size)
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

function handleErrors(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}