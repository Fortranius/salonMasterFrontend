export function getDashboardMasters(start, end) {
    return fetch("http://localhost:8080/dashboard/mastersBetweenStart?start=" + start + "&end=" + end)
        .then(handleErrors)
        .then(res => res.json())
        .then(val => {
            return val;
        });
}

export function getDashboardAll(start, end) {
    return fetch("http://localhost:8080/dashboard/all?start=" + start + "&end=" + end)
        .then(handleErrors)
        .then(res => res.json())
        .then(val => {
            return val;
        });
}

function handleErrors(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}