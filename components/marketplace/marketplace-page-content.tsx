"use client";

import { FilterSidebar } from "@/components/marketplace/filter-sidebar";
import { MarketplaceGrid } from "@/components/marketplace/marketplace-grid";
import { SearchBar } from "@/components/marketplace/search-bar";
import { useMarketplaceCategories, useMarketplaceListings } from "@/modules/marketplace/hooks";
import type { SearchFilters } from "@/modules/marketplace/types";

interface MarketplacePageContentProps {
  filters: SearchFilters;
}

export function MarketplacePageContent({ filters }: MarketplacePageContentProps) {
  const categoriesQuery = useMarketplaceCategories();
  const listingsQuery = useMarketplaceListings(filters);

  const errorMessage = getErrorMessage(listingsQuery.error);

  return (
    <>
      <section className="grid gap-4">
        <div className="grid gap-3">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Nexus marketplace</p>
          <div className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="grid gap-3">
              <h1 className="max-w-3xl text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Book trusted creative professionals for your next production.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-muted">
                Search curated photographers, filmmakers, designers, and event production teams through the Nexus
                marketplace data layer.
              </p>
            </div>
          </div>
        </div>
        <SearchBar defaultValue={filters.query} />
      </section>

      <section className="grid gap-6 lg:grid-cols-[18rem_minmax(0,1fr)]">
        <FilterSidebar categories={categoriesQuery.data ?? []} filters={filters} />
        <MarketplaceGrid
          errorMessage={errorMessage}
          isLoading={listingsQuery.isLoading || categoriesQuery.isLoading}
          listings={listingsQuery.data?.listings ?? []}
          total={listingsQuery.data?.total ?? 0}
        />
      </section>
    </>
  );
}

function getErrorMessage(error: Error | null) {
  return error?.message;
}
