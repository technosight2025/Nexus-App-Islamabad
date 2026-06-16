import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EventPageContent } from "@/components/events";
import { eventsQueryOptions } from "@/modules/events/hooks";
import { eventsService } from "@/modules/events/service";

interface EventPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: EventPageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const detail = await eventsService.getEvent(id);

    return {
      title: `${detail.event.title} | Nexus Event`,
      description: detail.event.description ?? "Live event memories, QR uploads, and guest media gallery.",
    };
  } catch {
    return {
      title: "Event | Nexus",
      description: "Live event memories, QR uploads, and guest media gallery.",
    };
  }
}

export default async function EventPage({ params }: EventPageProps) {
  const { id } = await params;
  const queryClient = new QueryClient();

  const eventPrefetch = await queryClient
    .fetchQuery(eventsQueryOptions.event(id))
    .catch(() => undefined);

  if (!eventPrefetch) {
    notFound();
  }

  await Promise.allSettled([
    queryClient.prefetchQuery(eventsQueryOptions.media(id)),
    queryClient.prefetchQuery(eventsQueryOptions.qrCode(id)),
  ]);

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-muted-surface/40">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <HydrationBoundary state={dehydrate(queryClient)}>
          <EventPageContent eventId={id} />
        </HydrationBoundary>
      </div>
    </main>
  );
}
