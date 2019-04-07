export function getStatisticMastersReport(start, end) {
    return fetch("http://localhost:8080/report/getStatisticMastersReport?start=" + start + "&end=" + end)
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