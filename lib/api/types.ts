export interface ApiErrorPayload {
  message: string;
  code?: string;
  fieldErrors?: Record<string, string[]>;
}

export interface ApiSuccessResponse<TData> {
  data: TData;
  meta?: Record<string, unknown>;
}

export type ApiResponse<TData> = ApiSuccessResponse<TData>;

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
