export interface Pagination {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}

export interface HealthResponse {
  status: string;
  wordpress: boolean;
  slotsLaunchPluginActive: boolean;
  sourceMode: string;
  gamesDetected: number;
  providersDetected: number;
}

export interface ApiError {
  error: {
    code: string;
    message: string;
  };
}
