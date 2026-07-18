export interface ApiEnvelope<T> {
  data: T;
}

export interface PaginatedResult<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
}

export interface ListQueryParams {
  page?: number;
  limit?: number;
}

export interface ApiErrorResponse {
  message: string | string[];
  code?: string;
  details?: Record<string, unknown>;
}
