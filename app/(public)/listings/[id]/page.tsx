import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ListingDetailContent } from "@/components/marketplace";
import { ApiError } from "@/lib/api";
import { marketplaceQueryOptions } from "@/modules/marketplace/hooks";
import { marketplaceService } from "@/modules/marketplace/service";

interface ListingDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ListingDetailPageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const listing = await marketplaceService.getListing(id);

    return {
      title: `${listing.title} | Nexus Marketplace`,
      description: listing.description,
    };
  } catch {
    return {
      title: "Listing not found | Nexus Marketplace",
    };
  }
}

export default async function ListingDetailPage({ params }: ListingDetailPageProps) {
  const { id } = await params;
  const queryClient = new QueryClient();

  try {
    await queryClient.fetchQuery(marketplaceQueryOptions.listing(id));
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }

    throw error;
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ListingDetailContent listingId={id} />
      </HydrationBoundary>
    </main>
  );
}
