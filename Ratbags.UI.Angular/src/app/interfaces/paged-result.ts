export interface PagedResult<T> {
  totalCount: number;
  items: T[];
  pageSize: number;
  currentPage: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}
