"use client";

import { useMemo, useState } from "react";
import { MediaGrid } from "@/components/events/media-grid";
import { UploadButton } from "@/components/events/upload-button";
import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui";
import { cn } from "@/lib/utils";
import type { EventMedia, EventRealtimeUpdate } from "@/modules/events/types";

type MediaCategory = "all" | "images" | "videos" | "approved" | "pending_review";

interface EventGalleryRealtimeConfig {
  channel: string;
  websocketUrl?: string;
  lastUpdate?: EventRealtimeUpdate<EventMedia>;
}

interface EventGalleryProps {
  media: EventMedia[];
  eventTitle: string;
  isUploading?: boolean;
  realtime?: EventGalleryRealtimeConfig;
  onFilesSelected?: (files: File[]) => void;
}

const mediaCategories: Array<{ label: string; value: MediaCategory }> = [
  { label: "All", value: "all" },
  { label: "Images", value: "images" },
  { label: "Videos", value: "videos" },
  { label: "Approved", value: "approved" },
  { label: "Pending", value: "pending_review" },
];

export function EventGallery({
  media,
  eventTitle,
  isUploading = false,
  realtime,
  onFilesSelected,
}: EventGalleryProps) {
  const [activeCategory, setActiveCategory] = useState<MediaCategory>("all");

  const filteredMedia = useMemo(() => {
    return media.filter((item) => {
      if (activeCategory === "images") {
        return item.type === "image";
      }

      if (activeCategory === "videos") {
        return item.type === "video";
      }

      if (activeCategory === "approved" || activeCategory === "pending_review") {
        return item.status === activeCategory;
      }

      return true;
    });
  }, [activeCategory, media]);

  return (
    <section className="grid gap-4">
      <Card className="overflow-hidden">
        <CardHeader className="gap-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <Badge variant="accent">Live Event Memories</Badge>
              <CardTitle className="mt-3 text-2xl">{eventTitle}</CardTitle>
              <CardDescription>
                Instagram-style guest feed for images and videos, structured for real-time gallery updates.
              </CardDescription>
            </div>
            <UploadButton isUploading={isUploading} onFilesSelected={onFilesSelected} />
          </div>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {mediaCategories.map((category) => (
              <button
                className={cn(
                  "shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
                  activeCategory === category.value
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted hover:bg-muted-surface hover:text-foreground",
                )}
                key={category.value}
                onClick={() => setActiveCategory(category.value)}
                type="button"
              >
                {category.label}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-2 rounded-2xl bg-muted-surface p-3 text-sm sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold text-foreground">Real-time updates</p>
              <p className="text-xs text-muted">
                {realtime?.websocketUrl
                  ? `Ready to subscribe to ${realtime.channel}`
                  : "WebSocket placeholder ready for live media events."}
              </p>
            </div>
            <Badge variant={realtime?.websocketUrl ? "success" : "neutral"}>
              {realtime?.websocketUrl ? "Socket ready" : "Placeholder"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <MediaGrid
        emptyMessage={
          activeCategory === "all"
            ? "Ask guests to scan the QR code and upload the first memory."
            : "No media matches this filter yet."
        }
        media={filteredMedia}
      />
    </section>
  );
}
