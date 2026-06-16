export type LeadStatus = "new" | "contacted" | "qualified" | "proposal_sent" | "won" | "lost";
export type LeadSource = "marketplace" | "referral" | "website" | "event" | "manual";
export type TaskStatus = "todo" | "in_progress" | "done" | "cancelled";
export type TaskPriority = "low" | "medium" | "high" | "urgent";

export interface PipelineStage {
  id: string;
  name: string;
  slug: LeadStatus;
  description?: string;
  order: number;
  color: string;
  createdAt: string;
  updatedAt: string;
}

export interface Lead {
  id: string;
  tenantId: string;
  ownerId: string;
  stageId: string;
  name: string;
  email?: string;
  phone?: string;
  companyName?: string;
  eventType?: string;
  eventDate?: string;
  estimatedValue: number;
  currency: "PKR";
  source: LeadSource;
  status: LeadStatus;
  lastContactedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CRMNote {
  id: string;
  leadId: string;
  authorId: string;
  body: string;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  leadId: string;
  assigneeId: string;
  title: string;
  description?: string;
  dueAt?: string;
  status: TaskStatus;
  priority: TaskPriority;
  createdAt: string;
  updatedAt: string;
}

export interface LeadFilters {
  query?: string;
  stageId?: string;
  status?: LeadStatus;
  ownerId?: string;
  source?: LeadSource;
}

export interface CRMBoard {
  stages: PipelineStage[];
  leads: Lead[];
}
