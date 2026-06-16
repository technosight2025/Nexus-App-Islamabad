"use client";

import Image from "next/image";
import Link from "next/link";
import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { useMarketplaceListing } from "@/modules/marketplace/hooks";

interface ListingDetailContentProps {
  listingId: string;
}

const priceFormatter = new Intl.NumberFormat("en-PK", {
  currency: "PKR",
  maximumFractionDigits: 0,
  style: "currency",
});

export function ListingDetailContent({ listingId }: ListingDetailContentProps) {
  const listingQuery = useMarketplaceListing(listingId);

  if (listingQuery.isLoading) {
    return (
      <Card className="overflow-hidden">
        <div className="aspect-[16/9] animate-pulse bg-muted-surface" />
        <CardContent className="grid gap-3 p-6">
          <div className="h-6 w-3/4 animate-pulse rounded-full bg-muted-surface" />
          <div className="h-4 w-1/2 animate-pulse rounded-full bg-muted-surface" />
          <div className="h-20 animate-pulse rounded-2xl bg-muted-surface" />
        </CardContent>
      </Card>
    );
  }

  if (listingQuery.error || !listingQuery.data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Listing unavailable</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <p className="text-sm leading-6 text-muted">
            {listingQuery.error?.message ?? "We could not load this listing. Please try again."}
          </p>
          <Link href="/marketplace">
            <Button variant="secondary">Back to marketplace</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  const listing = listingQuery.data;

  return (
    <div className="grid gap-6">
      <Link className="text-sm font-medium text-accent hover:underline" href="/marketplace">
        &larr; Back to marketplace
      </Link>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
        <div className="grid gap-6">
          <Card className="overflow-hidden">
            <div className="relative aspect-[16/9] bg-muted-surface">
              {listing.coverImageUrl ? (
                <Image
                  alt={listing.title}
                  className="object-cover"
                  fill
                  priority
                  sizes="(min-width: 1024px) 60vw, 100vw"
                  src={listing.coverImageUrl}
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm font-medium text-muted">Nexus</div>
              )}
              <div className="absolute left-4 top-4">
                <Badge variant="accent">{listing.category.name}</Badge>
              </div>
            </div>
          </Card>

          <div className="grid gap-3">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{listing.title}</h1>
            <p className="text-base text-muted">
              By <span className="font-semibold text-foreground">{listing.professionalName}</span> &middot; {listing.city}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted">
              <span className="font-semibold text-foreground">{listing.averageRating.toFixed(1)} rating</span>
              <span>{listing.reviewCount} reviews</span>
              <span>{listing.completedBookingsCount} completed bookings</span>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>About this service</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-base leading-7 text-muted">{listing.description}</p>
            </CardContent>
          </Card>
        </div>

        <aside className="grid gap-4 lg:sticky lg:top-8">
          <Card>
            <CardContent className="grid gap-4 p-6">
              <div className="grid gap-1">
                <span className="text-sm text-muted">Starting from</span>
                <span className="text-3xl font-bold text-foreground">{priceFormatter.format(listing.basePrice)}</span>
              </div>
              <Link className="grid" href="/login">
                <Button size="lg">Request to book</Button>
              </Link>
              <Link className="grid" href="/marketplace">
                <Button size="lg" variant="secondary">
                  Continue browsing
                </Button>
              </Link>
              <p className="text-xs leading-5 text-muted">
                You will be asked to sign in to confirm availability and complete your booking.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Service details</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted">Category</span>
                <span className="font-medium text-foreground">{listing.category.name}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted">City</span>
                <span className="font-medium text-foreground">{listing.city}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted">Currency</span>
                <span className="font-medium text-foreground">{listing.currency}</span>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
