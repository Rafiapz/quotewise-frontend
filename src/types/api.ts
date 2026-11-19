export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedApiResponse<T, TStats = unknown> {
  success: boolean;
  data: T[];
  meta: PaginationMeta;
  stats?: TStats;
  lowestUnitPrice?: number;
}
