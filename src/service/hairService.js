export function getAllHairCategories() {
    return fetch("http://localhost:8080/api/getAllHairCategories")
        .then(handleErrors)
        .then(res => res.json())
        .then(val => {
            return val;
        });
}

export function getAllHairs() {
    return fetch("http://localhost:8080/api/getAllHairs")
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