import {getUrl} from "./mainUrl";

export function getAllProductsBalance() {
    return fetch(getUrl() + "/api/getAllProductsBalance")
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