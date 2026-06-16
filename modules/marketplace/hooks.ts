"use client";

import { useQuery } from "@tanstack/react-query";
import { marketplaceService } from "@/modules/marketplace/service";
import type { SearchFilters } from "@/modules/marketplace/types";
import { normalizeSearchFilters } from "@/modules/marketplace/utils";

export const marketplaceQueryKeys = {
  all: ["marketplace"] as const,
  categories: () => [...marketplaceQueryKeys.all, "categories"] as const,
  listings: (filters: SearchFilters = {}) =>
    [...marketplaceQueryKeys.all, "listings", normalizeSearchFilters(filters)] as const,
};

export function useMarketplaceListings(filters: SearchFilters = {}) {
  return useQuery({
    queryKey: marketplaceQueryKeys.listings(filters),
    queryFn: () => marketplaceService.searchListings(filters),
  });
}

export function useMarketplaceCategories() {
  return useQuery({
    queryKey: marketplaceQueryKeys.categories(),
    queryFn: () => marketplaceService.listCategories(),
  });
}
