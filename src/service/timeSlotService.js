export function getTimeSlotsByDate(start, end, params) {
    return fetch("http://localhost:8080/api/timeSlotsByDate?start=" + start +
        "&end=" + end +
        "&page=" + params.page +
        "&size=" + params.size)
        .then(handleErrors)
        .then(res => res.json())
        .then(val => {
            return val;
        });
}

export function removeTimeSlot(timeSlot) {
    return fetch("http://localhost:8080/api/timeSlot/" + timeSlot, {method: "DELETE"})
        .then(handleErrors)
        .then(function(res){ return res })
}

export function updateTimeSlot(timeSlot) {
    return sendRequest(timeSlot, "PUT");
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