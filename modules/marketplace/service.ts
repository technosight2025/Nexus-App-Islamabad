import {
  getCategories,
  getListingById,
  getListings,
  searchListings,
  type MarketplaceApiState,
} from "@/modules/marketplace/api";
import type { Category, Listing, MarketplaceSearchResult, SearchFilters } from "@/modules/marketplace/types";
import { normalizeSearchFilters } from "@/modules/marketplace/utils";

export const marketplaceService = {
  async listListings(): Promise<MarketplaceSearchResult> {
    return unwrapMarketplaceState(await getListings());
  },

  async getListing(id: string): Promise<Listing> {
    return unwrapMarketplaceState(await getListingById(id));
  },

  async searchListings(filters: SearchFilters = {}): Promise<MarketplaceSearchResult> {
    return unwrapMarketplaceState(await searchListings(normalizeSearchFilters(filters)));
  },

  async listCategories(): Promise<Category[]> {
    return unwrapMarketplaceState(await getCategories());
  },
};

function unwrapMarketplaceState<TData>(state: MarketplaceApiState<TData>): TData {
  if (state.status === "error") {
    throw state.error;
  }

  if (state.status === "loading") {
    throw new Error("Marketplace API request is still loading.");
  }

  return state.data;
}
