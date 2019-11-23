import {getUrl} from "./mainUrl";

export function getAllHairCategories() {
    return fetch(getUrl() + "/api/getAllHairCategories")
        .then(handleErrors)
        .then(res => res.json())
        .then(val => {
            return val;
        });
}

export function getAllHairs() {
    return fetch(getUrl() + "/api/getAllHairs")
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