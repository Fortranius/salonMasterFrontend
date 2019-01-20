export function getMasters(params) {
    return fetch("http://localhost:8080/api/masters?page=" + params.page + "&size=" + params.size)
        .then(handleErrors)
        .then(res => res.json())
        .then(val => {
            return val;
        });
}

export function getAllMasters() {
    return fetch("http://localhost:8080/api/allMasters")
        .then(handleErrors)
        .then(res => res.json())
        .then(val => {
            return val;
        });
}

export function getMastersByFiO(name) {
    return fetch("http://localhost:8080/api/masters/name/" + name)
        .then(handleErrors)
        .then(res => res.json())
        .then(val => {
            return val;
        });
}

export function removeMaster(master) {
    return fetch("http://localhost:8080/api/master/" + master, {method: "DELETE"})
        .then(handleErrors)
        .then(function(res){ return res })
}

export function updateMaster(master) {
    return sendRequest(master, "PUT");
}

export function createMaster(master) {
    return sendRequest(master, "POST");
}

function sendRequest(master, method) {

    const options = {
        method: method,
        headers: new Headers({'content-type': 'application/json'}),
        body: JSON.stringify(master)
    };

    return fetch("http://localhost:8080/api/master", options)
        .then(handleErrors)
        .then(function(res){ return res })
}

function handleErrors(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}