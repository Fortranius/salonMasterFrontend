export function getExpenses(params) {
    return fetch("http://localhost:8080/api/expenses?page=" + params.page + "&size=" + params.size)
        .then(handleErrors)
        .then(res => res.json())
        .then(val => {
            return val;
        });
}

export function updateExpense(expense) {
    return sendRequest(expense, "PUT");
}

export function createExpense(expense) {
    return sendRequest(expense, "POST");
}

function sendRequest(expense, method) {

    const options = {
        method: method,
        headers: new Headers({'content-type': 'application/json'}),
        body: JSON.stringify(expense)
    };

    return fetch("http://localhost:8080/api/expense", options)
        .then(handleErrors)
        .then(function(res){ return res })
}

function handleErrors(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}