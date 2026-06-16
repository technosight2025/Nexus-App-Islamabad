import { ApiError, type ApiResponse } from "@/lib/api/types";

type LeadStatus = "new" | "contacted" | "qualified" | "proposal_sent" | "negotiation" | "won" | "lost";
type LeadSource = "marketplace" | "referral" | "website" | "event" | "manual";
type TaskStatus = "todo" | "in_progress" | "done" | "cancelled";
type TaskPriority = "low" | "medium" | "high" | "urgent";

interface MockPipelineStage {
  id: string;
  name: string;
  slug: LeadStatus;
  description?: string;
  order: number;
  color: string;
  createdAt: string;
  updatedAt: string;
}

interface MockLead {
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

interface MockCRMNote {
  id: string;
  leadId: string;
  authorId: string;
  body: string;
  createdAt: string;
  updatedAt: string;
}

interface MockTask {
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

interface MockCRMBoard {
  stages: MockPipelineStage[];
  leads: MockLead[];
}

interface CreateLeadBody {
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
  status?: LeadStatus;
}

const now = "2026-06-16T00:00:00.000Z";

const stages: MockPipelineStage[] = [
  {
    id: "new",
    name: "New",
    slug: "new",
    description: "New inbound opportunities.",
    order: 1,
    color: "bg-sky-500",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "contacted",
    name: "Contacted",
    slug: "contacted",
    description: "Leads that received an initial response.",
    order: 2,
    color: "bg-indigo-500",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "negotiation",
    name: "Negotiation",
    slug: "negotiation",
    description: "Pricing, scope, and booking terms are being negotiated.",
    order: 3,
    color: "bg-amber-500",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "won",
    name: "Won",
    slug: "won",
    description: "Confirmed opportunities.",
    order: 4,
    color: "bg-emerald-500",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "lost",
    name: "Lost",
    slug: "lost",
    description: "Closed lost opportunities.",
    order: 5,
    color: "bg-rose-500",
    createdAt: now,
    updatedAt: now,
  },
];

let leads: MockLead[] = [
  {
    id: "lead-001",
    tenantId: "tenant-nexus",
    ownerId: "pro-001",
    stageId: "new",
    name: "Ayesha Khan",
    email: "ayesha@example.com",
    phone: "+92 300 1111111",
    companyName: "Khan Family",
    eventType: "Wedding photography",
    eventDate: "2026-08-12",
    estimatedValue: 120000,
    currency: "PKR",
    source: "marketplace",
    status: "new",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "lead-002",
    tenantId: "tenant-nexus",
    ownerId: "pro-001",
    stageId: "contacted",
    name: "Bilal Ahmed",
    email: "bilal@example.com",
    phone: "+92 321 2222222",
    companyName: "Lumen Labs",
    eventType: "Corporate launch film",
    eventDate: "2026-07-04",
    estimatedValue: 210000,
    currency: "PKR",
    source: "referral",
    status: "contacted",
    lastContactedAt: "2026-06-15T12:30:00.000Z",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "lead-003",
    tenantId: "tenant-nexus",
    ownerId: "pro-001",
    stageId: "negotiation",
    name: "Sara Malik",
    email: "sara@example.com",
    phone: "+92 333 3333333",
    companyName: "Maison Events",
    eventType: "Mehndi production",
    eventDate: "2026-09-02",
    estimatedValue: 320000,
    currency: "PKR",
    source: "website",
    status: "negotiation",
    lastContactedAt: "2026-06-14T09:00:00.000Z",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "lead-004",
    tenantId: "tenant-nexus",
    ownerId: "pro-001",
    stageId: "won",
    name: "Hamza Sheikh",
    email: "hamza@example.com",
    companyName: "Sheikh Group",
    eventType: "Product campaign",
    estimatedValue: 85000,
    currency: "PKR",
    source: "manual",
    status: "won",
    lastContactedAt: "2026-06-12T17:00:00.000Z",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "lead-005",
    tenantId: "tenant-nexus",
    ownerId: "pro-001",
    stageId: "lost",
    name: "Noor Fatima",
    email: "noor@example.com",
    eventType: "Fashion editorial",
    estimatedValue: 55000,
    currency: "PKR",
    source: "event",
    status: "lost",
    lastContactedAt: "2026-06-10T15:45:00.000Z",
    createdAt: now,
    updatedAt: now,
  },
];

const notes: MockCRMNote[] = [
  {
    id: "note-001",
    leadId: "lead-001",
    authorId: "pro-001",
    body: "Client wants a premium album and same-day edit options.",
    createdAt: "2026-06-16T09:00:00.000Z",
    updatedAt: "2026-06-16T09:00:00.000Z",
  },
  {
    id: "note-002",
    leadId: "lead-003",
    authorId: "pro-001",
    body: "Negotiating decor vendor coordination and extended crew timing.",
    createdAt: "2026-06-15T11:20:00.000Z",
    updatedAt: "2026-06-15T11:20:00.000Z",
  },
];

const tasks: MockTask[] = [
  {
    id: "task-001",
    leadId: "lead-001",
    assigneeId: "pro-001",
    title: "Send package comparison",
    dueAt: "2026-06-18T10:00:00.000Z",
    status: "todo",
    priority: "high",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "task-002",
    leadId: "lead-003",
    assigneeId: "pro-001",
    title: "Confirm production scope",
    dueAt: "2026-06-17T12:00:00.000Z",
    status: "in_progress",
    priority: "urgent",
    createdAt: now,
    updatedAt: now,
  },
];

export async function resolveMockCRMRequest<TData>(
  path: string,
  method = "GET",
  body?: unknown,
): Promise<ApiResponse<TData> | undefined> {
  const url = new URL(path, "https://nexus.local");
  const pathname = url.pathname;

  if (!pathname.startsWith("/api/crm")) {
    return undefined;
  }

  if (method === "GET" && pathname === "/api/crm/board") {
    return asResponse<TData>({
      stages,
      leads: filterLeads(url.searchParams),
    } satisfies MockCRMBoard);
  }

  if (method === "GET" && pathname === "/api/crm/leads") {
    return asResponse<TData>(filterLeads(url.searchParams));
  }

  if (method === "POST" && pathname === "/api/crm/leads") {
    const payload = body as CreateLeadBody;
    const stage = stages.find((item) => item.id === payload.stageId);
    const lead: MockLead = {
      ...payload,
      id: `lead-${String(leads.length + 1).padStart(3, "0")}`,
      status: payload.status ?? stage?.slug ?? "new",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    leads = [lead, ...leads];
    return asResponse<TData>(lead);
  }

  if (method === "GET" && pathname === "/api/crm/pipeline-stages") {
    return asResponse<TData>(stages);
  }

  const leadPathMatch = pathname.match(/^\/api\/crm\/leads\/([^/]+)(?:\/([^/]+))?$/);

  if (!leadPathMatch) {
    return undefined;
  }

  const leadId = decodeURIComponent(leadPathMatch[1]);
  const childResource = leadPathMatch[2];

  if (method === "GET" && !childResource) {
    return asResponse<TData>(getLeadOrThrow(leadId));
  }

  if (method === "PATCH" && !childResource) {
    return asResponse<TData>(updateLead(leadId, body as Partial<MockLead>));
  }

  if (method === "PATCH" && childResource === "stage") {
    const payload = body as { stageId?: string };
    return asResponse<TData>(updateLeadStage(leadId, payload.stageId));
  }

  if (method === "GET" && childResource === "notes") {
    return asResponse<TData>(notes.filter((note) => note.leadId === leadId));
  }

  if (method === "GET" && childResource === "tasks") {
    return asResponse<TData>(tasks.filter((task) => task.leadId === leadId));
  }

  return undefined;
}

function filterLeads(params: URLSearchParams) {
  const query = normalizeText(params.get("query"));
  const stageId = normalizeText(params.get("stageId"));
  const status = normalizeText(params.get("status"));
  const ownerId = normalizeText(params.get("ownerId"));
  const source = normalizeText(params.get("source"));

  return leads.filter((lead) => {
    const matchesQuery = query
      ? [lead.name, lead.email, lead.phone, lead.companyName, lead.eventType]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(query.toLowerCase())
      : true;

    return (
      matchesQuery &&
      (stageId ? lead.stageId === stageId : true) &&
      (status ? lead.status === status : true) &&
      (ownerId ? lead.ownerId === ownerId : true) &&
      (source ? lead.source === source : true)
    );
  });
}

function getLeadOrThrow(leadId: string) {
  const lead = leads.find((item) => item.id === leadId);

  if (!lead) {
    throw new ApiError("Lead not found.", 404, {
      message: "Lead not found.",
      code: "CRM_LEAD_NOT_FOUND",
    });
  }

  return lead;
}

function updateLead(leadId: string, payload: Partial<MockLead>) {
  const currentLead = getLeadOrThrow(leadId);
  const updatedLead: MockLead = {
    ...currentLead,
    ...payload,
    id: currentLead.id,
    updatedAt: new Date().toISOString(),
  };

  leads = leads.map((lead) => (lead.id === leadId ? updatedLead : lead));
  return updatedLead;
}

function updateLeadStage(leadId: string, stageId?: string) {
  const stage = stages.find((item) => item.id === stageId);

  if (!stage) {
    throw new ApiError("Pipeline stage not found.", 404, {
      message: "Pipeline stage not found.",
      code: "CRM_STAGE_NOT_FOUND",
    });
  }

  return updateLead(leadId, {
    stageId: stage.id,
    status: stage.slug,
  });
}

function asResponse<TData>(data: unknown): ApiResponse<TData> {
  return { data: data as TData };
}

function normalizeText(value: string | null) {
  const trimmedValue = value?.trim();
  return trimmedValue ? trimmedValue : undefined;
}
