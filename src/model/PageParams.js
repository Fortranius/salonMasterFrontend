export default class PageParams {
    page;
    size;
    sortField;
    sortOrder;
    filters;

    constructor(page, size, sortField, sortOrder, filters) {
        this.page = page;
        this.size = size;
        this.sortField = sortField;
        this.sortOrder = sortOrder;
        this.filters = filters;
    }
}