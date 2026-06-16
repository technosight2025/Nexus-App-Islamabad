"use client";

import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui";
import type { CRMNote, Lead, Task } from "@/modules/crm/types";

interface LeadDetailsDrawerProps {
  lead?: Lead;
  notes?: CRMNote[];
  tasks?: Task[];
  isOpen: boolean;
  isLoading?: boolean;
  errorMessage?: string;
  onClose: () => void;
}

const valueFormatter = new Intl.NumberFormat("en-PK", {
  currency: "PKR",
  maximumFractionDigits: 0,
  style: "currency",
});

export function LeadDetailsDrawer({
  lead,
  notes = [],
  tasks = [],
  isOpen,
  isLoading = false,
  errorMessage,
  onClose,
}: LeadDetailsDrawerProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/30 backdrop-blur-sm">
      <button aria-label="Close lead details" className="absolute inset-0 cursor-default" onClick={onClose} />
      <aside className="relative grid h-full w-full max-w-xl grid-rows-[auto_1fr] overflow-hidden bg-background shadow-2xl">
        <header className="flex items-start justify-between gap-4 border-b border-border bg-card p-6">
          <div className="grid gap-2">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Lead details</p>
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">{lead?.name ?? "Loading lead"}</h2>
              <p className="mt-1 text-sm text-muted">{lead?.companyName ?? "CRM opportunity overview"}</p>
            </div>
          </div>
          <Button onClick={onClose} variant="secondary">
            Close
          </Button>
        </header>

        <div className="grid content-start gap-4 overflow-y-auto p-6">
          {isLoading ? (
            <DrawerStateCard title="Loading lead" description="Fetching CRM details, notes, and tasks." />
          ) : errorMessage ? (
            <DrawerStateCard title="Unable to load lead" description={errorMessage} />
          ) : lead ? (
            <>
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <CardTitle>Opportunity</CardTitle>
                      <CardDescription>{lead.eventType ?? "No event type recorded"}</CardDescription>
                    </div>
                    <Badge variant={lead.status === "won" ? "success" : lead.status === "lost" ? "warning" : "accent"}>
                      {formatStatus(lead.status)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="grid gap-3 text-sm">
                  <InfoRow label="Estimated value" value={valueFormatter.format(lead.estimatedValue)} />
                  <InfoRow label="Source" value={lead.source.replace("_", " ")} />
                  <InfoRow label="Event date" value={lead.eventDate ?? "Not set"} />
                  <InfoRow label="Last contacted" value={lead.lastContactedAt ? formatDate(lead.lastContactedAt) : "Not contacted"} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Contact</CardTitle>
                  <CardDescription>Primary lead contact information.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-3 text-sm">
                  <InfoRow label="Email" value={lead.email ?? "Not provided"} />
                  <InfoRow label="Phone" value={lead.phone ?? "Not provided"} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Notes</CardTitle>
                  <CardDescription>{notes.length} note{notes.length === 1 ? "" : "s"} recorded</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-3">
                  {notes.length > 0 ? (
                    notes.map((note) => (
                      <div className="rounded-2xl bg-muted-surface p-3 text-sm text-muted" key={note.id}>
                        <p>{note.body}</p>
                        <p className="mt-2 text-xs">{formatDate(note.createdAt)}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted">No notes yet.</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tasks</CardTitle>
                  <CardDescription>{tasks.length} follow-up task{tasks.length === 1 ? "" : "s"}</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-3">
                  {tasks.length > 0 ? (
                    tasks.map((task) => (
                      <div className="rounded-2xl border border-border p-3" key={task.id}>
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold text-foreground">{task.title}</p>
                            <p className="mt-1 text-xs text-muted">{task.dueAt ? formatDate(task.dueAt) : "No due date"}</p>
                          </div>
                          <Badge variant={task.priority === "urgent" || task.priority === "high" ? "warning" : "neutral"}>
                            {task.priority}
                          </Badge>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted">No open tasks.</p>
                  )}
                </CardContent>
              </Card>
            </>
          ) : (
            <DrawerStateCard title="No lead selected" description="Select a lead card to view details." />
          )}
        </div>
      </aside>
    </div>
  );
}

function DrawerStateCard({ title, description }: { title: string; description: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
    </Card>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl bg-muted-surface px-3 py-2">
      <span className="text-muted">{label}</span>
      <span className="text-right font-medium capitalize text-foreground">{value}</span>
    </div>
  );
}

function formatStatus(status: Lead["status"]) {
  return status
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-PK", {
    dateStyle: "medium",
  }).format(new Date(value));
}
