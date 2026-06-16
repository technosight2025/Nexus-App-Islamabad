import type { Metadata } from "next";
import { FilterSidebar, MarketplaceGrid, SearchBar } from "@/components/marketplace";
import { marketplaceService } from "@/modules/marketplace/service";
import type { Category, ListingSort, MarketplaceSearchResult, SearchFilters } from "@/modules/marketplace/types";

type MarketplaceSearchParams = Record<string, string | string[] | undefined>;

interface MarketplacePageProps {
  searchParams: Promise<MarketplaceSearchParams>;
}

interface MarketplaceDataState {
  categories: Category[];
  result: MarketplaceSearchResult | null;
  errorMessage?: string;
}

export const metadata: Metadata = {
  title: "Marketplace | Nexus",
  description: "Find creative professionals and production services across Pakistan.",
};

export default async function MarketplacePage({ searchParams }: MarketplacePageProps) {
  const resolvedSearchParams = await searchParams;
  const filters = mapSearchParamsToFilters(resolvedSearchParams);
  const marketplaceData = await getMarketplaceData(filters);

  return (
    <main className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <section className="grid gap-4">
        <div className="grid gap-3">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Nexus marketplace</p>
          <div className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="grid gap-3">
              <h1 className="max-w-3xl text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Book trusted creative professionals for your next production.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-muted">
                Search curated photographers, filmmakers, designers, and event production teams through a typed
                marketplace data layer.
              </p>
            </div>
          </div>
        </div>
        <SearchBar defaultValue={filters.query} />
      </section>

      <section className="grid gap-6 lg:grid-cols-[18rem_minmax(0,1fr)]">
        <FilterSidebar categories={marketplaceData.categories} filters={filters} />
        <MarketplaceGrid
          errorMessage={marketplaceData.errorMessage}
          listings={marketplaceData.result?.listings ?? []}
          total={marketplaceData.result?.total ?? 0}
        />
      </section>
    </main>
  );
}

async function getMarketplaceData(filters: SearchFilters): Promise<MarketplaceDataState> {
  const [categoriesResult, listingsResult] = await Promise.allSettled([
    marketplaceService.listCategories(),
    marketplaceService.searchListings(filters),
  ]);

  const categories = categoriesResult.status === "fulfilled" ? categoriesResult.value : [];

  if (listingsResult.status === "rejected") {
    return {
      categories,
      result: null,
      errorMessage: getErrorMessage(listingsResult.reason),
    };
  }

  return {
    categories,
    result: listingsResult.value,
  };
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

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Unable to load marketplace listings.";
}
