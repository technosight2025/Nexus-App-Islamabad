import { apiRequest } from "@/lib/api";
import type { Category, MarketplaceSearchResult, SearchFilters } from "@/modules/marketplace/types";
import { buildMarketplaceSearchParams } from "@/modules/marketplace/utils";

const MARKETPLACE_BASE_PATH = "/api/marketplace";

export async function fetchMarketplaceListings(filters: SearchFilters = {}) {
  const params = buildMarketplaceSearchParams(filters);
  const queryString = params.toString();
  const endpoint = queryString
    ? `${MARKETPLACE_BASE_PATH}/listings?${queryString}`
    : `${MARKETPLACE_BASE_PATH}/listings`;

  return apiRequest<MarketplaceSearchResult>(endpoint, {
    method: "GET",
  });
}

export async function fetchMarketplaceCategories() {
  return apiRequest<Category[]>(`${MARKETPLACE_BASE_PATH}/categories`, {
    method: "GET",
  });
}
