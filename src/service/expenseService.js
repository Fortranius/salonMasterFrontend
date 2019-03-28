export function getExpenses(params, start, end) {
    let sort = params.sortField ? "&sort=" + params.sortField +  ',' + params.sortOrder : '';
    let filterMaster= params.filters && params.filters['master.person.name'] ? "&masterId=" + params.filters['master.person.name'].filterVal : '';
    let filterProduct= params.filters && params.filters['product.description'] ? "&productId=" + params.filters['product.description'].filterVal : '';
    return fetch("http://localhost:8080/api/expenses?page=" + params.page
        + "&size=" + params.size + sort + filterMaster + filterProduct + "&start=" + start + "&end=" + end)
        .then(handleErrors)
        .then(res => res.json())
        .then(val => {
            return val;
        });
}

export function updateExpense(entity) {
    return sendRequest(entity, "PUT");
}

export function createExpense(entity) {
    return sendRequest(entity, "POST");
}

function sendRequest(entity, method) {

    const options = {
        method: method,
        headers: new Headers({'content-type': 'application/json'}),
        body: JSON.stringify(entity)
    };

    return fetch("http://localhost:8080/api/expense", options)
        .then(function(res){ return res })
}

function handleErrors(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}