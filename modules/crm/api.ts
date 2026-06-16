import { ApiError, apiRequest, type ApiResponse } from "@/lib/api";
import type { CRMBoard, CRMNote, Lead, LeadFilters, PipelineStage, Task } from "@/modules/crm/types";

const CRM_BASE_PATH = "/api/crm";

export interface CRMApiLoading {
  data: null;
  error: null;
  isLoading: true;
  status: "loading";
  meta?: undefined;
}

export interface CRMApiSuccess<TData> extends ApiResponse<TData> {
  error: null;
  isLoading: false;
  status: "success";
}

export interface CRMApiFailure {
  data: null;
  error: ApiError;
  isLoading: false;
  status: "error";
  meta?: undefined;
}

export type CRMApiState<TData> = CRMApiLoading | CRMApiSuccess<TData> | CRMApiFailure;

export function createCRMLoadingState(): CRMApiLoading {
  return {
    data: null,
    error: null,
    isLoading: true,
    status: "loading",
  };
}

export async function getCRMBoard(filters: LeadFilters = {}): Promise<CRMApiState<CRMBoard>> {
  return executeCRMRequest(
    apiRequest<CRMBoard>(buildCRMEndpoint("/board", filters), {
      method: "GET",
    }),
  );
}

export async function getLeads(filters: LeadFilters = {}): Promise<CRMApiState<Lead[]>> {
  return executeCRMRequest(
    apiRequest<Lead[]>(buildCRMEndpoint("/leads", filters), {
      method: "GET",
    }),
  );
}

export async function getLeadById(id: string): Promise<CRMApiState<Lead>> {
  const leadId = id.trim();

  if (!leadId) {
    return {
      data: null,
      error: new ApiError("Lead id is required.", 400),
      isLoading: false,
      status: "error",
    };
  }

  return executeCRMRequest(
    apiRequest<Lead>(`${CRM_BASE_PATH}/leads/${encodeURIComponent(leadId)}`, {
      method: "GET",
    }),
  );
}

export async function getPipelineStages(): Promise<CRMApiState<PipelineStage[]>> {
  return executeCRMRequest(
    apiRequest<PipelineStage[]>(`${CRM_BASE_PATH}/pipeline-stages`, {
      method: "GET",
    }),
  );
}

export async function getLeadNotes(leadId: string): Promise<CRMApiState<CRMNote[]>> {
  const normalizedLeadId = leadId.trim();

  if (!normalizedLeadId) {
    return {
      data: null,
      error: new ApiError("Lead id is required to load notes.", 400),
      isLoading: false,
      status: "error",
    };
  }

  return executeCRMRequest(
    apiRequest<CRMNote[]>(`${CRM_BASE_PATH}/leads/${encodeURIComponent(normalizedLeadId)}/notes`, {
      method: "GET",
    }),
  );
}

export async function getLeadTasks(leadId: string): Promise<CRMApiState<Task[]>> {
  const normalizedLeadId = leadId.trim();

  if (!normalizedLeadId) {
    return {
      data: null,
      error: new ApiError("Lead id is required to load tasks.", 400),
      isLoading: false,
      status: "error",
    };
  }

  return executeCRMRequest(
    apiRequest<Task[]>(`${CRM_BASE_PATH}/leads/${encodeURIComponent(normalizedLeadId)}/tasks`, {
      method: "GET",
    }),
  );
}

async function executeCRMRequest<TData>(request: Promise<ApiResponse<TData>>): Promise<CRMApiState<TData>> {
  try {
    const response = await request;

    return {
      ...response,
      error: null,
      isLoading: false,
      status: "success",
    };
  } catch (error) {
    return {
      data: null,
      error: toApiError(error),
      isLoading: false,
      status: "error",
    };
  }
}

function buildCRMEndpoint(path: string, filters: LeadFilters) {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      params.set(key, String(value));
    }
  });

  const queryString = params.toString();
  return queryString ? `${CRM_BASE_PATH}${path}?${queryString}` : `${CRM_BASE_PATH}${path}`;
}

function toApiError(error: unknown) {
  if (error instanceof ApiError) {
    return error;
  }

  return new ApiError("Unexpected CRM API error.", 500);
}
