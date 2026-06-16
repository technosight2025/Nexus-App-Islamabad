import { queryOptions, useQuery } from "@tanstack/react-query";
import { marketplaceService } from "@/modules/marketplace/service";
import type { SearchFilters } from "@/modules/marketplace/types";
import { normalizeSearchFilters } from "@/modules/marketplace/utils";

export const marketplaceQueryKeys = {
  all: ["marketplace"] as const,
  categories: () => [...marketplaceQueryKeys.all, "categories"] as const,
  listings: (filters: SearchFilters = {}) =>
    [...marketplaceQueryKeys.all, "listings", normalizeSearchFilters(filters)] as const,
  listing: (id: string) => [...marketplaceQueryKeys.all, "listing", id] as const,
};

export const marketplaceQueryOptions = {
  categories: () =>
    queryOptions({
      queryKey: marketplaceQueryKeys.categories(),
      queryFn: () => marketplaceService.listCategories(),
    }),
  listings: (filters: SearchFilters = {}) =>
    queryOptions({
      queryKey: marketplaceQueryKeys.listings(filters),
      queryFn: () => marketplaceService.searchListings(filters),
    }),
  listing: (id: string) =>
    queryOptions({
      queryKey: marketplaceQueryKeys.listing(id),
      queryFn: () => marketplaceService.getListing(id),
    }),
};

export function useMarketplaceListings(filters: SearchFilters = {}) {
  return useQuery(marketplaceQueryOptions.listings(filters));
}

export function useMarketplaceCategories() {
  return useQuery(marketplaceQueryOptions.categories());
}

export function useMarketplaceListing(id: string) {
  return useQuery(marketplaceQueryOptions.listing(id));
}
