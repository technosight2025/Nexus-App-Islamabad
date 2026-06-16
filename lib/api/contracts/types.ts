export type ApiErrorCode =
  | "BAD_REQUEST"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "VALIDATION_ERROR"
  | "RATE_LIMITED"
  | "INTERNAL_ERROR";

export interface ApiFieldError {
  field: string;
  message: string;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: ApiErrorCode;
    message: string;
    fields?: ApiFieldError[];
    requestId?: string;
  };
}

export interface ApiMeta {
  requestId?: string;
  timestamp: string;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ApiSuccessResponse<TData, TMeta = Record<string, unknown>> {
  success: true;
  data: TData;
  meta?: ApiMeta & TMeta;
}

export type PaginatedApiSuccessResponse<TData> = ApiSuccessResponse<TData[], { pagination: PaginationMeta }> & {
  meta: ApiMeta & {
    pagination: PaginationMeta;
  };
};

export type ApiContractResponse<TData, TMeta = Record<string, unknown>> =
  | ApiSuccessResponse<TData, TMeta>
  | ApiErrorResponse;

export type PaginatedApiContractResponse<TData> = PaginatedApiSuccessResponse<TData> | ApiErrorResponse;
