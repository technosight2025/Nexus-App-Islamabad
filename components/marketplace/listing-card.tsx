import Image from "next/image";
import Link from "next/link";
import { Badge, Card } from "@/components/ui";
import type { Listing } from "@/modules/marketplace/types";

interface ListingCardProps {
  listing: Listing;
}

const priceFormatter = new Intl.NumberFormat("en-PK", {
  currency: "PKR",
  maximumFractionDigits: 0,
  style: "currency",
});

export function ListingCard({ listing }: ListingCardProps) {
  return (
    <Card className="group overflow-hidden transition hover:-translate-y-0.5 hover:shadow-lg">
      <Link className="grid h-full" href={`/marketplace/listings/${listing.id}`}>
        <div className="relative aspect-[4/3] overflow-hidden bg-muted-surface">
          {listing.coverImageUrl ? (
            <Image
              alt={listing.title}
              className="object-cover transition duration-300 group-hover:scale-105"
              fill
              sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 100vw"
              src={listing.coverImageUrl}
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-muted-surface text-sm font-medium text-muted">
              Nexus
            </div>
          )}
          <div className="absolute left-3 top-3">
            <Badge variant="accent">{listing.category.name}</Badge>
          </div>
        </div>

        <div className="grid gap-4 p-4">
          <div className="grid gap-2">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="line-clamp-2 text-base font-semibold leading-6 text-foreground">{listing.title}</h3>
                <p className="mt-1 text-sm text-muted">{listing.professionalName}</p>
              </div>
              <div className="shrink-0 rounded-full bg-muted-surface px-2.5 py-1 text-xs font-semibold text-foreground">
                {listing.averageRating.toFixed(1)}
              </div>
            </div>
            <p className="line-clamp-2 text-sm leading-6 text-muted">{listing.description}</p>
          </div>

          <div className="flex items-end justify-between gap-3 border-t border-border pt-4">
            <div className="grid gap-1 text-sm text-muted">
              <span>{listing.city}</span>
              <span>{listing.reviewCount} reviews</span>
            </div>
            <p className="text-right text-sm text-muted">
              From{" "}
              <span className="block text-base font-bold text-foreground">
                {priceFormatter.format(listing.basePrice)}
              </span>
            </p>
          </div>
        </div>
      </Link>
    </Card>
  );
}
