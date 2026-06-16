import { ApiError, type ApiErrorPayload, type ApiResponse } from "@/lib/api/types";
import { resolveMockCRMRequest } from "@/lib/api/mock-crm";
import { resolveMockMarketplaceRequest } from "@/lib/api/mock-marketplace";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
}

async function parseJson<T>(response: Response): Promise<T | undefined> {
  if (response.status === 204) {
    return undefined;
  }

  const contentType = response.headers.get("content-type");
  if (!contentType?.includes("application/json")) {
    return undefined;
  }

  return response.json() as Promise<T>;
}

export async function apiRequest<TData>(
  path: string,
  options: RequestOptions = {},
): Promise<ApiResponse<TData>> {
  const method = options.method ?? "GET";
  const mockResponse = await resolveLocalMockRequest<TData>(path, method, options.body);

  if (mockResponse) {
    return mockResponse;
  }

  const headers = new Headers(options.headers);

  if (options.body !== undefined && !headers.has("content-type")) {
    headers.set("content-type", "application/json");
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });

  const payload = await parseJson<ApiResponse<TData> | ApiErrorPayload>(response);

  if (!response.ok) {
    const errorPayload = payload as ApiErrorPayload | undefined;
    throw new ApiError(
      errorPayload?.message ?? "Something went wrong while contacting the Nexus API.",
      response.status,
      errorPayload,
    );
  }

  return (payload ?? { data: undefined as TData }) as ApiResponse<TData>;
}

async function resolveLocalMockRequest<TData>(path: string, method: string, body?: unknown) {
  if (API_BASE_URL) {
    return undefined;
  }

  if (path.startsWith("/api/marketplace")) {
    return resolveMockMarketplaceRequest<TData>(path, method);
  }

  if (path.startsWith("/api/crm")) {
    return resolveMockCRMRequest<TData>(path, method, body);
  }

  return undefined;
}
