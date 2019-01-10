export function getDashboardMasters() {
    return fetch("http://localhost:8080/dashboard/masters")
        .then(handleErrors)
        .then(res => res.json())
        .then(val => {
            return val;
        });
}

export function getDashboardAll() {
    return fetch("http://localhost:8080/dashboard/all")
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