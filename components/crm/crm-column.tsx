"use client";

import type { DragEvent } from "react";
import { CRMCard } from "@/components/crm/crm-card";
import { Card } from "@/components/ui";
import { cn } from "@/lib/utils";
import type { Lead, LeadStatus } from "@/modules/crm/types";

export interface CRMKanbanStage {
  id: string;
  name: string;
  slug: LeadStatus;
  color: string;
}

interface CRMColumnProps {
  activeLeadId?: string;
  isDragTarget?: boolean;
  leads: Lead[];
  onDragEnd: () => void;
  onDragEnter: (stageId: string) => void;
  onDragStart: (leadId: string) => void;
  onDropLead: (leadId: string, stageId: string) => void;
  stage: CRMKanbanStage;
}

export function CRMColumn({
  activeLeadId,
  isDragTarget = false,
  leads,
  onDragEnd,
  onDragEnter,
  onDragStart,
  onDropLead,
  stage,
}: CRMColumnProps) {
  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    onDragEnter(stage.id);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    const leadId = event.dataTransfer.getData("text/plain");

    if (leadId) {
      onDropLead(leadId, stage.id);
    }
  }

  return (
    <Card
      className={cn(
        "flex min-h-[28rem] flex-col bg-muted-surface/60 p-3 transition",
        isDragTarget ? "border-accent bg-accent/10 ring-4 ring-accent/10" : null,
      )}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="mb-3 flex items-center justify-between gap-3 px-1">
        <div className="flex items-center gap-2">
          <span className={cn("h-3 w-3 rounded-full", stage.color)} />
          <h2 className="text-sm font-semibold text-foreground">{stage.name}</h2>
        </div>
        <span className="rounded-full bg-card px-2.5 py-1 text-xs font-semibold text-muted">{leads.length}</span>
      </div>

      <div className="grid flex-1 content-start gap-3">
        {leads.length > 0 ? (
          leads.map((lead) => (
            <CRMCard
              isDragging={activeLeadId === lead.id}
              key={lead.id}
              lead={lead}
              onDragEnd={onDragEnd}
              onDragStart={onDragStart}
            />
          ))
        ) : (
          <div className="flex min-h-32 items-center justify-center rounded-3xl border border-dashed border-border bg-card/70 p-4 text-center text-sm text-muted">
            Drop leads here
          </div>
        )}
      </div>
    </Card>
  );
}
