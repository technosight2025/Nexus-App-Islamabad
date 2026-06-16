import { fetchMarketplaceCategories, fetchMarketplaceListings } from "@/modules/marketplace/api";
import type { Category, MarketplaceSearchResult, SearchFilters } from "@/modules/marketplace/types";
import { normalizeSearchFilters } from "@/modules/marketplace/utils";

export const marketplaceService = {
  async searchListings(filters: SearchFilters = {}): Promise<MarketplaceSearchResult> {
    const response = await fetchMarketplaceListings(normalizeSearchFilters(filters));
    return response.data;
  },

  async listCategories(): Promise<Category[]> {
    const response = await fetchMarketplaceCategories();
    return response.data;
  },
};
