import { ApiError, apiRequest, type ApiResponse } from "@/lib/api";
import type { Category, Listing, MarketplaceSearchResult, SearchFilters } from "@/modules/marketplace/types";
import { buildMarketplaceSearchParams } from "@/modules/marketplace/utils";

const MARKETPLACE_BASE_PATH = "/api/marketplace";

export interface MarketplaceApiLoading {
  data: null;
  error: null;
  isLoading: true;
  status: "loading";
  meta?: undefined;
}

export interface MarketplaceApiSuccess<TData> extends ApiResponse<TData> {
  error: null;
  isLoading: false;
  status: "success";
}

export interface MarketplaceApiFailure {
  data: null;
  error: ApiError;
  isLoading: false;
  status: "error";
  meta?: undefined;
}

export type MarketplaceApiState<TData> =
  | MarketplaceApiLoading
  | MarketplaceApiSuccess<TData>
  | MarketplaceApiFailure;

export function createMarketplaceLoadingState(): MarketplaceApiLoading {
  return {
    data: null,
    error: null,
    isLoading: true,
    status: "loading",
  };
}

export async function getListings(): Promise<MarketplaceApiState<MarketplaceSearchResult>> {
  return executeMarketplaceRequest(
    apiRequest<MarketplaceSearchResult>(`${MARKETPLACE_BASE_PATH}/listings`, {
      method: "GET",
    }),
  );
}

export async function getListingById(id: string): Promise<MarketplaceApiState<Listing>> {
  const listingId = id.trim();

  if (!listingId) {
    return {
      data: null,
      error: new ApiError("Listing id is required.", 400),
      isLoading: false,
      status: "error",
    };
  }

  return executeMarketplaceRequest(
    apiRequest<Listing>(`${MARKETPLACE_BASE_PATH}/listings/${encodeURIComponent(listingId)}`, {
      method: "GET",
    }),
  );
}

export async function searchListings(
  filters: SearchFilters = {},
): Promise<MarketplaceApiState<MarketplaceSearchResult>> {
  const params = buildMarketplaceSearchParams(filters);
  const queryString = params.toString();
  const endpoint = queryString
    ? `${MARKETPLACE_BASE_PATH}/listings?${queryString}`
    : `${MARKETPLACE_BASE_PATH}/listings`;

  return executeMarketplaceRequest(
    apiRequest<MarketplaceSearchResult>(endpoint, {
      method: "GET",
    }),
  );
}

export async function getCategories(): Promise<MarketplaceApiState<Category[]>> {
  return executeMarketplaceRequest(
    apiRequest<Category[]>(`${MARKETPLACE_BASE_PATH}/categories`, {
      method: "GET",
    }),
  );
}

async function executeMarketplaceRequest<TData>(
  request: Promise<ApiResponse<TData>>,
): Promise<MarketplaceApiState<TData>> {
  try {
    const response = await request;

    return {
      ...response,
      error: null,
      isLoading: false,
      status: "success",
    };
  } catch (error) {
    return {
      data: null,
      error: toApiError(error),
      isLoading: false,
      status: "error",
    };
  }
}

function toApiError(error: unknown) {
  if (error instanceof ApiError) {
    return error;
  }

  return new ApiError("Unexpected marketplace API error.", 500);
}
