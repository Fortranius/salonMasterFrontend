import {getUrl} from "./mainUrl";

export function getStatisticMastersReport(start, end, reportType, master) {
    let masterId = master ? "&masterId=" + master.id : '';
    let report = reportType===0 ? "getStatisticMastersReport" : "getIncomesBetweenDate";
    return fetch(getUrl() + "/report/" + report + "?start=" + start + "&end=" + end + masterId)
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