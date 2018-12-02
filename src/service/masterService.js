export function getMasters(params) {
    return fetch("http://localhost:8080/api/masters?page=" + params.page + "&size=" + params.size)
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

function handleErrors(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}