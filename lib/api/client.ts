import { ApiError, type ApiEnvelope, type ApiErrorPayload, type ApiResponse } from "@/lib/api/types";
import { resolveMockBookingsRequest } from "@/lib/api/mock-bookings";
import { resolveMockCRMRequest } from "@/lib/api/mock-crm";
import { resolveMockEventsRequest } from "@/lib/api/mock-events";
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

  const payload = await parseJson<ApiEnvelope<TData> | ApiErrorPayload>(response);

  if (!response.ok) {
    const errorPayload = normalizeApiErrorPayload(payload);
    throw new ApiError(
      errorPayload?.message ?? "Something went wrong while contacting the Nexus API.",
      response.status,
      errorPayload,
    );
  }

  return normalizeApiSuccessPayload<TData>(payload);
}

async function resolveLocalMockRequest<TData>(path: string, method: string, body?: unknown) {
  if (API_BASE_URL) {
    return undefined;
  }

  if (path.startsWith("/api/marketplace")) {
    return resolveMockMarketplaceRequest<TData>(path, method);
  }

  if (path.startsWith("/api/bookings")) {
    return resolveMockBookingsRequest<TData>(path, method, body);
  }

  if (path.startsWith("/api/crm")) {
    return resolveMockCRMRequest<TData>(path, method, body);
  }

  if (path.startsWith("/api/events")) {
    return resolveMockEventsRequest<TData>(path, method, body);
  }

  return undefined;
}

function normalizeApiSuccessPayload<TData>(payload: ApiEnvelope<TData> | ApiErrorPayload | undefined): ApiResponse<TData> {
  if (!payload) {
    return { data: undefined as TData };
  }

  if ("success" in payload && payload.success === true) {
    return {
      data: payload.data,
      meta: payload.meta,
      success: true,
    };
  }

  return payload as ApiResponse<TData>;
}

function normalizeApiErrorPayload<TData>(
  payload: ApiEnvelope<TData> | ApiErrorPayload | undefined,
): ApiErrorPayload | undefined {
  if (!payload) {
    return undefined;
  }

  if ("success" in payload && payload.success === false) {
    return {
      message: payload.error.message,
      code: payload.error.code,
      fieldErrors: payload.error.fields?.reduce<Record<string, string[]>>((accumulator, fieldError) => {
        accumulator[fieldError.field] = [...(accumulator[fieldError.field] ?? []), fieldError.message];
        return accumulator;
      }, {}),
    };
  }

  return payload as ApiErrorPayload;
}
