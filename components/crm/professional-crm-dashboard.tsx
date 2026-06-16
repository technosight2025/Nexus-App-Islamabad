"use client";

import { useState } from "react";
import { CRMBoard, LeadDetailsDrawer } from "@/components/crm";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui";
import {
  useCRMBoard,
  useCRMLead,
  useCRMLeadNotes,
  useCRMLeadTasks,
  useMoveCRMLeadStage,
} from "@/modules/crm/hooks";

export function ProfessionalCRMDashboard() {
  const [selectedLeadId, setSelectedLeadId] = useState<string>();
  const boardQuery = useCRMBoard();
  const leadQuery = useCRMLead(selectedLeadId);
  const notesQuery = useCRMLeadNotes(selectedLeadId);
  const tasksQuery = useCRMLeadTasks(selectedLeadId);
  const moveLeadStage = useMoveCRMLeadStage();

  const selectedLead = leadQuery.data ?? boardQuery.data?.leads.find((lead) => lead.id === selectedLeadId);

  if (boardQuery.isLoading) {
    return (
      <section className="grid gap-4 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <div className="min-h-[28rem] animate-pulse rounded-3xl border border-border bg-muted-surface" key={index} />
        ))}
      </section>
    );
  }

  if (boardQuery.error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Unable to load CRM pipeline</CardTitle>
          <CardDescription>{boardQuery.error.message}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <>
      <CRMBoard
        leads={boardQuery.data?.leads ?? []}
        onLeadSelect={setSelectedLeadId}
        onLeadStageChange={(leadId, stageId) => {
          moveLeadStage.mutate({ id: leadId, stage: stageId });
        }}
        stages={boardQuery.data?.stages}
      />
      <LeadDetailsDrawer
        errorMessage={leadQuery.error?.message}
        isLoading={Boolean(selectedLeadId) && (leadQuery.isLoading || notesQuery.isLoading || tasksQuery.isLoading)}
        isOpen={Boolean(selectedLeadId)}
        lead={selectedLead}
        notes={notesQuery.data}
        onClose={() => setSelectedLeadId(undefined)}
        tasks={tasksQuery.data}
      />
    </>
  );
}
