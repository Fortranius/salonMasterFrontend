export function getProducts() {
    return fetch("http://localhost:8080/api/products")
        .then(handleErrors)
        .then(res => res.json())
        .then(val => {
            return val;
        });
}

export function getProductsByDescription(description) {
    return fetch("http://localhost:8080/api/products/description/" + description)
        .then(handleErrors)
        .then(res => res.json())
        .then(val => {
            return val;
        });
}

export function createProduct(entity) {
    return sendRequest(entity, "POST");
}

export function updateProduct(entity) {
    return sendRequest(entity, "PUT");
}

function sendRequest(entity, method) {

    const options = {
        method: method,
        headers: new Headers({'content-type': 'application/json'}),
        body: JSON.stringify(entity)
    };

    return fetch("http://localhost:8080/api/product", options)
        .then(handleErrors)
        .then(function(res){ return res })
}

function handleErrors(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}