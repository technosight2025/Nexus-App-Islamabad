import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui";
import { ListingCard } from "@/components/marketplace/listing-card";
import type { Listing } from "@/modules/marketplace/types";

interface MarketplaceGridProps {
  listings: Listing[];
  total: number;
  errorMessage?: string;
  isLoading?: boolean;
}

export function MarketplaceGrid({ listings, total, errorMessage, isLoading = false }: MarketplaceGridProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card className="overflow-hidden" key={index}>
            <div className="aspect-[4/3] animate-pulse bg-muted-surface" />
            <CardContent className="grid gap-3 p-4">
              <div className="h-4 w-3/4 animate-pulse rounded-full bg-muted-surface" />
              <div className="h-4 w-1/2 animate-pulse rounded-full bg-muted-surface" />
              <div className="h-10 animate-pulse rounded-2xl bg-muted-surface" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (errorMessage) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Marketplace unavailable</CardTitle>
          <CardDescription>{errorMessage}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (listings.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No listings found</CardTitle>
          <CardDescription>Try adjusting your search terms, city, price range, or category filters.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <section className="grid gap-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-muted">
          Showing <span className="text-foreground">{listings.length}</span> of{" "}
          <span className="text-foreground">{total}</span> listings
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {listings.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>
    </section>
  );
}
