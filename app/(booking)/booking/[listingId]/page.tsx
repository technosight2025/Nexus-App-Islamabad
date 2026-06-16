import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookingFlow } from "@/components/bookings";
import { ApiError } from "@/lib/api";
import { marketplaceQueryOptions } from "@/modules/marketplace/hooks";

interface BookingPageProps {
  params: Promise<{ listingId: string }>;
}

export const metadata: Metadata = {
  title: "Book a service | Nexus",
  description: "Select a package, share your event details, and confirm your Nexus booking.",
};

export default async function BookingPage({ params }: BookingPageProps) {
  const { listingId } = await params;
  const queryClient = new QueryClient();

  try {
    await queryClient.fetchQuery(marketplaceQueryOptions.listing(listingId));
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }

    throw error;
  }

  return (
    <main className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid gap-2">
        <Link className="text-sm font-medium text-accent hover:underline" href={`/listings/${listingId}`}>
          &larr; Back to listing
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Book this service</h1>
        <p className="max-w-2xl text-base leading-7 text-muted">
          Choose a package, share your event details, and confirm your booking with Nexus.
        </p>
      </div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <BookingFlow listingId={listingId} />
      </HydrationBoundary>
    </main>
  );
}
