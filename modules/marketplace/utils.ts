import type { SearchFilters } from "@/modules/marketplace/types";

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 24;

export function normalizeSearchFilters(filters: SearchFilters = {}): SearchFilters {
  return {
    query: normalizeText(filters.query),
    categorySlug: normalizeText(filters.categorySlug),
    city: normalizeText(filters.city),
    minPrice: normalizeNumber(filters.minPrice),
    maxPrice: normalizeNumber(filters.maxPrice),
    minRating: normalizeNumber(filters.minRating),
    page: normalizePositiveInteger(filters.page) ?? DEFAULT_PAGE,
    pageSize: normalizePositiveInteger(filters.pageSize) ?? DEFAULT_PAGE_SIZE,
    sort: filters.sort ?? "recommended",
  };
}

export function buildMarketplaceSearchParams(filters: SearchFilters = {}): URLSearchParams {
  const normalizedFilters = normalizeSearchFilters(filters);
  const params = new URLSearchParams();

  Object.entries(normalizedFilters).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      params.set(key, String(value));
    }
  });

  return params;
}

function normalizeText(value?: string) {
  const trimmedValue = value?.trim();
  return trimmedValue ? trimmedValue : undefined;
}

function normalizeNumber(value?: number) {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function normalizePositiveInteger(value?: number) {
  if (typeof value !== "number" || !Number.isInteger(value) || value < 1) {
    return undefined;
  }

  return value;
}
