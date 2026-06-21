export interface ApiResponse<T> {
  code: number;
  data: T;
  message?: string;
}

export interface PageResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}
