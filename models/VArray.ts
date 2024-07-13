export interface VArray<T> {
    data: T[];
    totalPages: number;
    currentPage: number;
    pageSize: number;
    totalRecords: number;
}