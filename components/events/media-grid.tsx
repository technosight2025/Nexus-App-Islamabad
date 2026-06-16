"use client";

import { Badge, Card, CardContent } from "@/components/ui";
import type { EventMedia } from "@/modules/events/types";

interface MediaGridProps {
  media: EventMedia[];
  emptyMessage?: string;
}

export function MediaGrid({ media, emptyMessage = "No memories uploaded yet." }: MediaGridProps) {
  if (media.length === 0) {
    return (
      <Card>
        <CardContent className="grid min-h-64 place-items-center p-6 text-center">
          <div>
            <p className="text-lg font-semibold text-foreground">Gallery is waiting</p>
            <p className="mt-2 text-sm text-muted">{emptyMessage}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
      {media.map((item, index) => (
        <article
          className={index % 7 === 0 ? "col-span-2 row-span-2" : undefined}
          key={item.id}
        >
          <Card className="group h-full overflow-hidden">
            <div className="relative aspect-square overflow-hidden bg-muted-surface">
              {item.type === "video" ? (
                <video
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  controls
                  muted
                  playsInline
                  poster={item.thumbnailUrl}
                  src={item.url}
                />
              ) : (
                <div
                  aria-label={item.caption ?? "Event memory image"}
                  className="h-full w-full bg-cover bg-center transition duration-300 group-hover:scale-105"
                  role="img"
                  style={{ backgroundImage: `url(${item.thumbnailUrl ?? item.url})` }}
                />
              )}

              <div className="absolute left-2 top-2">
                <Badge variant={item.type === "video" ? "warning" : "neutral"}>{item.type}</Badge>
              </div>

              {item.caption ? (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/80 to-transparent p-3">
                  <p className="line-clamp-2 text-xs font-medium text-white">{item.caption}</p>
                </div>
              ) : null}
            </div>
          </Card>
        </article>
      ))}
    </div>
  );
}
