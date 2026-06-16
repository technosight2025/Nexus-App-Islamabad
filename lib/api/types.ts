import type { ApiContractResponse, ApiErrorCode, ApiMeta } from "@/lib/api/contracts";

export interface ApiErrorPayload {
  message: string;
  code?: string | ApiErrorCode;
  fieldErrors?: Record<string, string[]>;
}

export interface ApiSuccessResponse<TData> {
  data: TData;
  success?: true;
  meta?: (ApiMeta & Record<string, unknown>) | Record<string, unknown>;
}

export type ApiResponse<TData> = ApiSuccessResponse<TData>;
export type ApiEnvelope<TData> = ApiResponse<TData> | ApiContractResponse<TData>;

export class ApiError extends Error {
  status: number;
  payload?: ApiErrorPayload;

  constructor(message: string, status: number, payload?: ApiErrorPayload) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}
