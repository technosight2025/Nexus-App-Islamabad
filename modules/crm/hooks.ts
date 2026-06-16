import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { crmService } from "@/modules/crm/service";
import type { CreateLeadInput, LeadFilters, MoveLeadStageInput, UpdateLeadInput } from "@/modules/crm/types";

interface UpdateLeadVariables {
  id: string;
  data: UpdateLeadInput;
}

interface MoveLeadStageVariables {
  id: string;
  stage: MoveLeadStageInput["stageId"];
}

export const crmQueryKeys = {
  all: ["crm"] as const,
  board: (filters: LeadFilters = {}) => [...crmQueryKeys.all, "board", filters] as const,
  leads: (filters: LeadFilters = {}) => [...crmQueryKeys.all, "leads", filters] as const,
  lead: (id: string) => [...crmQueryKeys.all, "leads", id] as const,
  notes: (leadId: string) => [...crmQueryKeys.all, "leads", leadId, "notes"] as const,
  pipelineStages: () => [...crmQueryKeys.all, "pipeline-stages"] as const,
  tasks: (leadId: string) => [...crmQueryKeys.all, "leads", leadId, "tasks"] as const,
};

export const crmQueryOptions = {
  board: (filters: LeadFilters = {}) =>
    queryOptions({
      queryKey: crmQueryKeys.board(filters),
      queryFn: () => crmService.getBoard(filters),
    }),
  leads: (filters: LeadFilters = {}) =>
    queryOptions({
      queryKey: crmQueryKeys.leads(filters),
      queryFn: () => crmService.listLeads(filters),
    }),
  lead: (id: string) =>
    queryOptions({
      queryKey: crmQueryKeys.lead(id),
      queryFn: () => crmService.getLead(id),
    }),
  notes: (leadId: string) =>
    queryOptions({
      queryKey: crmQueryKeys.notes(leadId),
      queryFn: () => crmService.listLeadNotes(leadId),
    }),
  pipelineStages: () =>
    queryOptions({
      queryKey: crmQueryKeys.pipelineStages(),
      queryFn: () => crmService.listPipelineStages(),
    }),
  tasks: (leadId: string) =>
    queryOptions({
      queryKey: crmQueryKeys.tasks(leadId),
      queryFn: () => crmService.listLeadTasks(leadId),
    }),
};

export function useCRMBoard(filters: LeadFilters = {}) {
  return useQuery(crmQueryOptions.board(filters));
}

export function useCRMLeads(filters: LeadFilters = {}) {
  return useQuery(crmQueryOptions.leads(filters));
}

export function useCRMLead(id: string) {
  return useQuery(crmQueryOptions.lead(id));
}

export function useCRMLeadNotes(leadId: string) {
  return useQuery(crmQueryOptions.notes(leadId));
}

export function useCRMPipelineStages() {
  return useQuery(crmQueryOptions.pipelineStages());
}

export function useCRMLeadTasks(leadId: string) {
  return useQuery(crmQueryOptions.tasks(leadId));
}

export function useCreateCRMLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateLeadInput) => crmService.createLead(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: crmQueryKeys.all });
    },
  });
}

export function useUpdateCRMLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: UpdateLeadVariables) => crmService.updateLead(id, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: crmQueryKeys.all });
    },
  });
}

export function useMoveCRMLeadStage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, stage }: MoveLeadStageVariables) => crmService.moveLeadStage(id, stage),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: crmQueryKeys.all });
    },
  });
}
