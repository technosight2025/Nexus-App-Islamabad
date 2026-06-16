"use client";

import type { DragEvent } from "react";
import { Badge, Card } from "@/components/ui";
import { cn } from "@/lib/utils";
import type { Lead } from "@/modules/crm/types";

interface CRMCardProps {
  lead: Lead;
  isDragging?: boolean;
  onDragStart?: (leadId: string) => void;
  onDragEnd?: () => void;
}

const valueFormatter = new Intl.NumberFormat("en-PK", {
  currency: "PKR",
  maximumFractionDigits: 0,
  style: "currency",
});

export function CRMCard({ lead, isDragging = false, onDragStart, onDragEnd }: CRMCardProps) {
  function handleDragStart(event: DragEvent<HTMLDivElement>) {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", lead.id);
    onDragStart?.(lead.id);
  }

  return (
    <Card
      className={cn(
        "cursor-grab p-4 transition hover:-translate-y-0.5 hover:shadow-md active:cursor-grabbing",
        isDragging ? "border-accent opacity-60 ring-4 ring-accent/10" : null,
      )}
      draggable
      onDragEnd={onDragEnd}
      onDragStart={handleDragStart}
    >
      <div className="grid gap-4">
        <div className="grid gap-2">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="truncate text-sm font-semibold text-foreground">{lead.name}</h3>
              {lead.companyName ? <p className="mt-1 truncate text-xs text-muted">{lead.companyName}</p> : null}
            </div>
            <Badge variant={lead.status === "won" ? "success" : lead.status === "lost" ? "warning" : "neutral"}>
              {formatStatus(lead.status)}
            </Badge>
          </div>
          {lead.eventType ? <p className="text-xs leading-5 text-muted">{lead.eventType}</p> : null}
        </div>

        <div className="rounded-2xl bg-muted-surface p-3">
          <p className="text-xs font-medium text-muted">Estimated value</p>
          <p className="mt-1 text-base font-bold text-foreground">{valueFormatter.format(lead.estimatedValue)}</p>
        </div>

        <div className="grid gap-1 text-xs text-muted">
          {lead.email ? <span className="truncate">{lead.email}</span> : null}
          {lead.phone ? <span>{lead.phone}</span> : null}
          <span className="capitalize">Source: {lead.source.replace("_", " ")}</span>
        </div>
      </div>
    </Card>
  );
}

function formatStatus(status: Lead["status"]) {
  return status
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
