import {
  getCRMBoard,
  getLeadById,
  getLeadNotes,
  getLeads,
  getLeadTasks,
  getPipelineStages,
  type CRMApiState,
} from "@/modules/crm/api";
import type { CRMBoard, CRMNote, Lead, LeadFilters, PipelineStage, Task } from "@/modules/crm/types";

export const crmService = {
  async getBoard(filters: LeadFilters = {}): Promise<CRMBoard> {
    return unwrapCRMState(await getCRMBoard(filters));
  },

  async listLeads(filters: LeadFilters = {}): Promise<Lead[]> {
    return unwrapCRMState(await getLeads(filters));
  },

  async getLead(id: string): Promise<Lead> {
    return unwrapCRMState(await getLeadById(id));
  },

  async listPipelineStages(): Promise<PipelineStage[]> {
    return unwrapCRMState(await getPipelineStages());
  },

  async listLeadNotes(leadId: string): Promise<CRMNote[]> {
    return unwrapCRMState(await getLeadNotes(leadId));
  },

  async listLeadTasks(leadId: string): Promise<Task[]> {
    return unwrapCRMState(await getLeadTasks(leadId));
  },
};

function unwrapCRMState<TData>(state: CRMApiState<TData>): TData {
  if (state.status === "error") {
    throw state.error;
  }

  if (state.status === "loading") {
    throw new Error("CRM API request is still loading.");
  }

  return state.data;
}
