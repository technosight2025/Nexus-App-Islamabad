import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import type { Metadata } from "next";
import { MarketplacePageContent } from "@/components/marketplace";
import { marketplaceQueryOptions } from "@/modules/marketplace/hooks";
import type { ListingSort, SearchFilters } from "@/modules/marketplace/types";

type MarketplaceSearchParams = Record<string, string | string[] | undefined>;

interface MarketplacePageProps {
  searchParams: Promise<MarketplaceSearchParams>;
}

export const metadata: Metadata = {
  title: "Marketplace | Nexus",
  description: "Find creative professionals and production services across Pakistan.",
};

export default async function MarketplacePage({ searchParams }: MarketplacePageProps) {
  const resolvedSearchParams = await searchParams;
  const filters = mapSearchParamsToFilters(resolvedSearchParams);
  const queryClient = new QueryClient();

  await Promise.allSettled([
    queryClient.prefetchQuery(marketplaceQueryOptions.categories()),
    queryClient.prefetchQuery(marketplaceQueryOptions.listings(filters)),
  ]);

  return (
    <main className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <MarketplacePageContent filters={filters} />
      </HydrationBoundary>
    </main>
  );
}

function mapSearchParamsToFilters(searchParams: MarketplaceSearchParams): SearchFilters {
  return {
    query: getStringParam(searchParams.query),
    categorySlug: getStringParam(searchParams.categorySlug),
    city: getStringParam(searchParams.city),
    minPrice: getNumberParam(searchParams.minPrice),
    maxPrice: getNumberParam(searchParams.maxPrice),
    minRating: getNumberParam(searchParams.minRating),
    sort: getSortParam(searchParams.sort),
  };
}

function getStringParam(value: string | string[] | undefined) {
  const resolvedValue = Array.isArray(value) ? value[0] : value;
  const trimmedValue = resolvedValue?.trim();
  return trimmedValue ? trimmedValue : undefined;
}

function getNumberParam(value: string | string[] | undefined) {
  const resolvedValue = getStringParam(value);

  if (!resolvedValue) {
    return undefined;
  }

  const parsedValue = Number(resolvedValue);
  return Number.isFinite(parsedValue) ? parsedValue : undefined;
}

function getSortParam(value: string | string[] | undefined): ListingSort | undefined {
  const resolvedValue = getStringParam(value);

  if (
    resolvedValue === "recommended" ||
    resolvedValue === "price_asc" ||
    resolvedValue === "price_desc" ||
    resolvedValue === "rating_desc" ||
    resolvedValue === "newest"
  ) {
    return resolvedValue;
  }

  return undefined;
}
