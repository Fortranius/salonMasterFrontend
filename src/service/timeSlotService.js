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

export function createTimeSlot(timeSlot) {
    return sendRequest(timeSlot, "POST");
}

function sendRequest(timeSlot, method) {

    const options = {
        method: method,
        headers: new Headers({'content-type': 'application/json'}),
        body: JSON.stringify(timeSlot)
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