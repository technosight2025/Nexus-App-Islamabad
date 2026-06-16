"use client";

import { useMemo, useState } from "react";
import { CRMColumn, type CRMKanbanStage } from "@/components/crm/crm-column";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui";
import type { Lead } from "@/modules/crm/types";

interface CRMBoardProps {
  leads: Lead[];
  stages?: CRMKanbanStage[];
  onLeadStageChange?: (leadId: string, stageId: string) => void | Promise<void>;
  onLeadSelect?: (leadId: string) => void;
}

export const defaultCRMStages: CRMKanbanStage[] = [
  {
    id: "new",
    name: "New",
    slug: "new",
    color: "bg-sky-500",
  },
  {
    id: "contacted",
    name: "Contacted",
    slug: "contacted",
    color: "bg-indigo-500",
  },
  {
    id: "negotiation",
    name: "Negotiation",
    slug: "negotiation",
    color: "bg-amber-500",
  },
  {
    id: "won",
    name: "Won",
    slug: "won",
    color: "bg-emerald-500",
  },
  {
    id: "lost",
    name: "Lost",
    slug: "lost",
    color: "bg-rose-500",
  },
];

export function CRMBoard({ leads, stages = defaultCRMStages, onLeadStageChange, onLeadSelect }: CRMBoardProps) {
  const [activeLeadId, setActiveLeadId] = useState<string>();
  const [activeStageId, setActiveStageId] = useState<string>();
  const [stageOverrides, setStageOverrides] = useState<Record<string, string>>({});

  const leadsByStage = useMemo(() => {
    return stages.reduce<Record<string, Lead[]>>((accumulator, stage) => {
      accumulator[stage.id] = [];
      return accumulator;
    }, {});
  }, [stages]);

  const groupedLeads = useMemo(() => {
    const groups = Object.fromEntries(stages.map((stage) => [stage.id, [] as Lead[]]));

    leads.forEach((lead) => {
      const stageId = stageOverrides[lead.id] ?? lead.stageId;
      const targetStageId = groups[stageId] ? stageId : stages[0]?.id;

      if (targetStageId) {
        groups[targetStageId].push(lead);
      }
    });

    return {
      ...leadsByStage,
      ...groups,
    };
  }, [leads, leadsByStage, stageOverrides, stages]);

  function handleDropLead(leadId: string, stageId: string) {
    setStageOverrides((currentOverrides) => ({
      ...currentOverrides,
      [leadId]: stageId,
    }));
    setActiveLeadId(undefined);
    setActiveStageId(undefined);
    void onLeadStageChange?.(leadId, stageId);
  }

  function handleDragEnd() {
    setActiveLeadId(undefined);
    setActiveStageId(undefined);
  }

  if (leads.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>CRM pipeline</CardTitle>
          <CardDescription>No leads are available for this pipeline yet.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="secondary">Create your first lead</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <section className="grid gap-4">
      <div className="flex flex-col justify-between gap-3 rounded-3xl border border-border bg-card p-4 shadow-sm sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">CRM pipeline</p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground">Lead Kanban Board</h1>
          <p className="mt-1 text-sm text-muted">Drag leads between stages to update the sales workflow.</p>
        </div>
        <div className="rounded-2xl bg-muted-surface px-4 py-3 text-sm text-muted">
          <span className="font-semibold text-foreground">{leads.length}</span> active leads
        </div>
      </div>

      <div className="grid gap-4 overflow-x-auto pb-2 lg:grid-cols-5">
        {stages.map((stage) => (
          <CRMColumn
            activeLeadId={activeLeadId}
            isDragTarget={activeStageId === stage.id}
            key={stage.id}
            leads={groupedLeads[stage.id] ?? []}
            onDragEnd={handleDragEnd}
            onDragEnter={setActiveStageId}
            onDragStart={setActiveLeadId}
            onDropLead={handleDropLead}
            onLeadSelect={onLeadSelect}
            stage={stage}
          />
        ))}
      </div>
    </section>
  );
}
