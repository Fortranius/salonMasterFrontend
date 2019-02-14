export function getTimeSlotsByDate(start, end) {
    return fetch("http://localhost:8080/api/timeSlotsByDate?start=" + start +
        "&end=" + end)
        .then(handleErrors)
        .then(res => res.json())
        .then(val => {
            return val;
        });
}

export function getTimeSlotsByClientId(clientId) {
    return fetch("http://localhost:8080/api/timeSlotsByClientId?clientId=" + clientId)
        .then(handleErrors)
        .then(res => res.json())
        .then(val => {
            return val;
        });
}

export function createTimeSlot(entity) {
    return sendRequest(entity, "POST");
}

function sendRequest(entity, method) {

    const options = {
        method: method,
        headers: new Headers({'content-type': 'application/json'}),
        body: JSON.stringify(entity)
    };

    return fetch("http://localhost:8080/api/timeSlot", options)
        .then(handleErrors)
        .then(function(res){ return res })
}

function handleErrors(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}