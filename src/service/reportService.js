import {getUrl} from "./mainUrl";

export function getMastersReport(start, end) {
    return fetch(getUrl() + "/report/getMastersReport?start=" + start + "&end=" + end)
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

export function getExpensesReport(params, start, end) {
    let sort = params.sortOrder ? "&sort=" + params.sortField +  ',' + params.sortOrder : '';
    let filterMaster= params.filters && params.filters['master.person.name'] ? "&masterId=" + params.filters['master.person.name'].filterVal : '';
    let filterProduct= params.filters && params.filters['product.description'] ? "&productId=" + params.filters['product.description'].filterVal : '';
    return fetch(getUrl() + "/report/getExpensesReport?start=" + start + "&end=" + end + sort + filterMaster + filterProduct)
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

export function getIncomingReport(params, start, end) {
    let sort = params.sortOrder ? "&sort=" + params.sortField +  ',' + params.sortOrder : '';
    let filterProduct= params.filters && params.filters['product.description'] ? "&productId=" + params.filters['product.description'].filterVal : '';
    return fetch(getUrl() + "/report/getIncomingReport?start=" + start + "&end=" + end + sort + filterProduct)
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

export function getAdditionalIncomingReport(params, start, end) {
    let sort = params.sortOrder ? "&sort=" + params.sortField +  ',' + params.sortOrder : '';
    let filterMaster= params.filters && params.filters['master.person.name'] ? "&masterId=" + params.filters['master.person.name'].filterVal : '';
    return fetch(getUrl() + "/report/getAdditionalIncomingReport?start=" + start + "&end=" + end + sort + filterMaster)
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