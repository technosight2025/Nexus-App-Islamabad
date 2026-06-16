import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { eventsService } from "@/modules/events/service";
import type {
  CreateEventGuestInput,
  CreateEventInput,
  CreateQRCodeInput,
  EventFilters,
  UpdateEventInput,
  UploadMediaInput,
} from "@/modules/events/types";

interface UpdateEventVariables {
  id: string;
  data: UpdateEventInput;
}

export const eventsQueryKeys = {
  all: ["events"] as const,
  events: (filters: EventFilters = {}) => [...eventsQueryKeys.all, "list", filters] as const,
  event: (id: string) => [...eventsQueryKeys.all, "detail", id] as const,
  guests: (eventId: string) => [...eventsQueryKeys.all, "detail", eventId, "guests"] as const,
  media: (eventId: string) => [...eventsQueryKeys.all, "detail", eventId, "media"] as const,
  qrCode: (eventId: string) => [...eventsQueryKeys.all, "detail", eventId, "qr-code"] as const,
};

export const eventsQueryOptions = {
  events: (filters: EventFilters = {}) =>
    queryOptions({
      queryKey: eventsQueryKeys.events(filters),
      queryFn: () => eventsService.listEvents(filters),
    }),
  event: (id: string) =>
    queryOptions({
      queryKey: eventsQueryKeys.event(id),
      queryFn: () => eventsService.getEvent(id),
      enabled: id.trim().length > 0,
    }),
  guests: (eventId: string) =>
    queryOptions({
      queryKey: eventsQueryKeys.guests(eventId),
      queryFn: () => eventsService.listEventGuests(eventId),
      enabled: eventId.trim().length > 0,
    }),
  media: (eventId: string) =>
    queryOptions({
      queryKey: eventsQueryKeys.media(eventId),
      queryFn: () => eventsService.listEventMedia(eventId),
      enabled: eventId.trim().length > 0,
    }),
  qrCode: (eventId: string) =>
    queryOptions({
      queryKey: eventsQueryKeys.qrCode(eventId),
      queryFn: () => eventsService.getEventQRCode(eventId),
      enabled: eventId.trim().length > 0,
    }),
};

export function useEvents(filters: EventFilters = {}) {
  return useQuery(eventsQueryOptions.events(filters));
}

export function useEvent(id = "") {
  return useQuery(eventsQueryOptions.event(id));
}

export function useEventGuests(eventId = "") {
  return useQuery(eventsQueryOptions.guests(eventId));
}

export function useEventMedia(eventId = "") {
  return useQuery(eventsQueryOptions.media(eventId));
}

export function useEventQRCode(eventId = "") {
  return useQuery(eventsQueryOptions.qrCode(eventId));
}

export function useCreateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateEventInput) => eventsService.createEvent(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: eventsQueryKeys.all });
    },
  });
}

export function useUpdateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: UpdateEventVariables) => eventsService.updateEvent(id, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: eventsQueryKeys.all });
    },
  });
}

export function useCreateEventGuest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateEventGuestInput) => eventsService.createEventGuest(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: eventsQueryKeys.all });
    },
  });
}

export function useCreateEventQRCode() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateQRCodeInput) => eventsService.generateQRCode(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: eventsQueryKeys.all });
    },
  });
}

export function useUploadEventMedia() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UploadMediaInput) => eventsService.uploadMedia(data),
    onSuccess: async (media) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: eventsQueryKeys.event(media.eventId) }),
        queryClient.invalidateQueries({ queryKey: eventsQueryKeys.media(media.eventId) }),
      ]);
    },
  });
}

export function useGenerateEventQRCode() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateQRCodeInput) => eventsService.generateQRCode(data),
    onSuccess: async (qrCode) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: eventsQueryKeys.event(qrCode.eventId) }),
        queryClient.invalidateQueries({ queryKey: eventsQueryKeys.qrCode(qrCode.eventId) }),
      ]);
    },
  });
}
