import type { ZodError, ZodType } from "zod";
import type {
  ApiErrorCode,
  ApiErrorResponse,
  ApiFieldError,
  ApiSuccessResponse,
  PaginatedApiSuccessResponse,
  PaginationMeta,
  PaginationParams,
} from "@/lib/api/contracts/types";

export function createApiSuccess<TData>(data: TData): ApiSuccessResponse<TData> {
  return {
    success: true,
    data,
    meta: {
      timestamp: new Date().toISOString(),
    },
  };
}

export function createPaginatedApiSuccess<TData>(
  data: TData[],
  pagination: PaginationMeta,
): PaginatedApiSuccessResponse<TData> {
  return {
    success: true,
    data,
    meta: {
      pagination,
      timestamp: new Date().toISOString(),
    },
  };
}

export function createApiError(
  code: ApiErrorCode,
  message: string,
  fields?: ApiFieldError[],
): ApiErrorResponse {
  return {
    success: false,
    error: {
      code,
      message,
      fields,
    },
  };
}

export function createPaginationMeta(params: PaginationParams & { total: number }): PaginationMeta {
  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? 24;
  const totalPages = Math.ceil(params.total / pageSize);

  return {
    page,
    pageSize,
    total: params.total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
}

export function parseApiInput<TData>(schema: ZodType<TData>, input: unknown) {
  return schema.safeParse(input);
}

export function zodErrorToFieldErrors(error: ZodError): ApiFieldError[] {
  return error.issues.map((issue) => ({
    field: issue.path.join("."),
    message: issue.message,
  }));
}
