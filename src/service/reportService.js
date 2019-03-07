export function getMastersReport(params) {
    return fetch("http://localhost:8080/report/getMastersReport")
        .then(handleErrors)
        .then(res => res.json())
        .then(val => {
            return val;
        });
}
export function getExpensesReport(params, start, end) {
    console.log(params);
    let sort = params.sortOrder ? "&sort=" + params.sortField +  ',' + params.sortOrder : '';
    let filterMaster= params.filters && params.filters['master.person.name'] ? "&masterId=" + params.filters['master.person.name'].filterVal : '';
    let filterProduct= params.filters && params.filters['product.description'] ? "&productId=" + params.filters['product.description'].filterVal : '';
    return fetch("http://localhost:8080/report/getExpensesReport?start=" + start + "&end=" + end + sort + filterMaster + filterProduct)
        .then(handleErrors)
        .then(res => {
            return res.blob();
        }).then(blob => {
            let url = window.URL.createObjectURL(blob);
            let a = document.createElement('a');
            a.href = url;
            a.download = 'отчет.xlsx';
            a.click();
        }).catch(err => console.error(err));
}

function handleErrors(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}