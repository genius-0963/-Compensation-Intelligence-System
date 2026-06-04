export type SortDirection = "asc" | "desc";
export type FilterOperator = "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "in" | "contains";

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
