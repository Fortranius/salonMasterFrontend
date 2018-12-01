export function getMasters() {
    return fetch("http://localhost:8080/api/masters")
        .then(handleErrors)
        .then(res => res.json())
        .then(json => {
            return json;
        });
}

function handleErrors(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}