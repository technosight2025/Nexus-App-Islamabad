"use client";

import { EventGallery } from "@/components/events/event-gallery";
import { QRCodeGenerator } from "@/components/events/qr-code-generator";
import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui";
import {
  useEvent,
  useEventMedia,
  useEventQRCode,
  useGenerateEventQRCode,
  useUploadEventMedia,
} from "@/modules/events/hooks";
import type { EventMediaType } from "@/modules/events/types";

interface EventPageContentProps {
  eventId: string;
}

export function EventPageContent({ eventId }: EventPageContentProps) {
  const eventQuery = useEvent(eventId);
  const mediaQuery = useEventMedia(eventId);
  const qrCodeQuery = useEventQRCode(eventId);
  const uploadMedia = useUploadEventMedia();
  const generateQRCode = useGenerateEventQRCode();

  const event = eventQuery.data?.event;
  const media = mediaQuery.data ?? eventQuery.data?.media ?? [];
  const qrCode = qrCodeQuery.data ?? eventQuery.data?.qrCode;

  async function handleFilesSelected(files: File[]) {
    await Promise.all(
      files.map((file) =>
        uploadMedia.mutateAsync({
          eventId,
          url: URL.createObjectURL(file),
          type: getMediaType(file),
          caption: file.name,
        }),
      ),
    );
  }

  async function handleGenerateQRCode() {
    await generateQRCode.mutateAsync({ eventId });
  }

  if (eventQuery.isLoading) {
    return (
      <div className="grid gap-6">
        <div className="h-56 animate-pulse rounded-3xl bg-muted-surface" />
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="h-96 animate-pulse rounded-3xl bg-muted-surface" />
          <div className="h-96 animate-pulse rounded-3xl bg-muted-surface" />
        </div>
      </div>
    );
  }

  if (eventQuery.error || !event) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Unable to load event</CardTitle>
          <CardDescription>{eventQuery.error?.message ?? "The requested event could not be found."}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="grid gap-6">
      <Card className="overflow-hidden">
        <div className="bg-primary p-6 text-primary-foreground sm:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="grid gap-3">
              <Badge variant="accent">Event Memories</Badge>
              <div>
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{event.title}</h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-primary-foreground/80">
                  {event.description ?? "Live guest uploads, QR access, and event media feed."}
                </p>
              </div>
            </div>
            <div className="rounded-3xl bg-white/10 p-4 text-sm">
              <p className="font-semibold">{formatDate(event.eventDate)}</p>
              <p className="mt-1 text-primary-foreground/75">
                {event.venue}, {event.city}
              </p>
            </div>
          </div>
        </div>
        <CardContent className="grid gap-4 p-4 sm:grid-cols-3 sm:p-6">
          <MetadataTile label="Status" value={event.status} />
          <MetadataTile label="Guests" value={String(eventQuery.data?.guests.length ?? 0)} />
          <MetadataTile label="Media" value={String(media.length)} />
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <EventGallery
          eventTitle={event.title}
          isUploading={uploadMedia.isPending}
          media={media}
          onFilesSelected={handleFilesSelected}
          realtime={{
            channel: `events:${event.id}:media`,
            lastUpdate: undefined,
          }}
        />

        <aside className="grid content-start gap-4 lg:sticky lg:top-24">
          <QRCodeGenerator
            canGenerate
            errorMessage={generateQRCode.error?.message ?? qrCodeQuery.error?.message}
            isGenerating={generateQRCode.isPending}
            onGenerate={handleGenerateQRCode}
            qrCode={qrCode}
          />

          <Card>
            <CardHeader>
              <CardTitle>Upload system</CardTitle>
              <CardDescription>Guests can scan the QR code or use the mobile upload button in the live feed.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm">
              <MetadataTile label="Upload access" value={qrCode ? "Active" : "Needs QR"} />
              <MetadataTile label="Review queue" value={`${media.filter((item) => item.status === "pending_review").length} pending`} />
              <MetadataTile label="Realtime channel" value={`events:${event.id}:media`} />
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}

function MetadataTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-muted-surface p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">{label}</p>
      <p className="mt-2 break-words text-sm font-bold capitalize text-foreground">{value.replace("_", " ")}</p>
    </div>
  );
}

function getMediaType(file: File): EventMediaType {
  return file.type.startsWith("video/") ? "video" : "image";
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-PK", {
    dateStyle: "full",
    timeStyle: "short",
  }).format(new Date(value));
}
