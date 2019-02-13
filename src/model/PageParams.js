export default class PageParams {
    page;
    size;
    sortField;
    sortOrder;

    constructor(page, size, sortField, sortOrder) {
        this.page = page;
        this.size = size;
        this.sortField = sortField;
        this.sortOrder = sortOrder;
    }
}