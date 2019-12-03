import {getUrl} from "./mainUrl";

export function getTimeSlotsByDate(start, end) {
    return fetch(getUrl() + "/api/timeSlotsByDate?start=" + start +
        "&end=" + end)
        .then(handleErrors)
        .then(res => res.json())
        .then(val => {
            return val;
        });
}

export function getTimeSlotsByClientId(clientId) {
    return fetch(getUrl() + "/api/timeSlotsByClientId?clientId=" + clientId)
        .then(handleErrors)
        .then(res => res.json())
        .then(val => {
            return val;
        });
}

export function createTimeSlot(entity) {
    return sendRequest(entity, "POST");
}

export function deleteTimeSlot(id) {
    return fetch(getUrl() + "/api/timeSlot/" + id, {
        method: 'delete'
    }).then(res => res);
}

function sendRequest(entity, method) {

    const options = {
        method: method,
        headers: new Headers({'content-type': 'application/json'}),
        body: JSON.stringify(entity)
    };

    return fetch(getUrl() + "/api/timeSlot", options)
        .then(function(res){ return res })
}

function handleErrors(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}