export function getIncomings(params, start, end) {
    let sort = params.sortField ? "&sort=" + params.sortField +  ',' + params.sortOrder : '';
    let filterProduct= params.filters && params.filters['product.description'] ? "&productId=" + params.filters['product.description'].filterVal : '';
    return fetch("http://localhost:8080/api/incomings?page=" + params.page
        + "&size=" + params.size + sort + filterProduct + "&start=" + start + "&end=" + end)
        .then(handleErrors)
        .then(res => res.json())
        .then(val => {
            return val;
        });
}

export function updateIncoming(entity) {
    return sendRequest(entity, "PUT");
}

export function createIncoming(entity) {
    return sendRequest(entity, "POST");
}

function sendRequest(entity, method) {

    const options = {
        method: method,
        headers: new Headers({'content-type': 'application/json'}),
        body: JSON.stringify(entity)
    };

    return fetch("http://localhost:8080/api/incoming", options)
        .then(function(res){ return res })
}

function handleErrors(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}