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

export function allMastersByWorkDay(date) {
    return fetch("http://localhost:8080/api/allMastersByWorkDay?date=" + date)
        .then(handleErrors)
        .then(res => res.json())
        .then(val => {
            return val;
        });
}

export function allMastersByDayOff(date) {
    return fetch("http://localhost:8080/api/allMastersByDayOff?date=" + date)
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

export function updateMaster(entity) {
    return sendRequest(entity, "PUT");
}

export function createMaster(entity) {
    return sendRequest(entity, "POST");
}

function sendRequest(entity, method) {

    const options = {
        method: method,
        headers: new Headers({'content-type': 'application/json'}),
        body: JSON.stringify(entity)
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