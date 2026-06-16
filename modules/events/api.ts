import { ApiError, apiRequest, type ApiResponse } from "@/lib/api";
import type {
  CreateEventGuestInput,
  CreateEventInput,
  CreateQRCodeInput,
  Event,
  EventDetail,
  EventFilters,
  EventGuest,
  EventMedia,
  QRCode,
  UpdateEventInput,
} from "@/modules/events/types";

const EVENTS_BASE_PATH = "/api/events";

export interface EventsApiLoading {
  data: null;
  error: null;
  isLoading: true;
  status: "loading";
  meta?: undefined;
}

export interface EventsApiSuccess<TData> extends ApiResponse<TData> {
  error: null;
  isLoading: false;
  status: "success";
}

export interface EventsApiFailure {
  data: null;
  error: ApiError;
  isLoading: false;
  status: "error";
  meta?: undefined;
}

export type EventsApiState<TData> = EventsApiLoading | EventsApiSuccess<TData> | EventsApiFailure;

export function createEventsLoadingState(): EventsApiLoading {
  return {
    data: null,
    error: null,
    isLoading: true,
    status: "loading",
  };
}

export async function getEvents(filters: EventFilters = {}): Promise<EventsApiState<Event[]>> {
  return executeEventsRequest(
    apiRequest<Event[]>(buildEventsEndpoint("", filters), {
      method: "GET",
    }),
  );
}

export async function createEvent(data: CreateEventInput): Promise<EventsApiState<Event>> {
  const validationError = validateCreateEventInput(data);

  if (validationError) {
    return validationError;
  }

  return executeEventsRequest(
    apiRequest<Event>(EVENTS_BASE_PATH, {
      body: data,
      method: "POST",
    }),
  );
}

export async function getEventById(id: string): Promise<EventsApiState<EventDetail>> {
  const eventId = id.trim();

  if (!eventId) {
    return createEventsFailure("Event id is required.", 400);
  }

  return executeEventsRequest(
    apiRequest<EventDetail>(`${EVENTS_BASE_PATH}/${encodeURIComponent(eventId)}`, {
      method: "GET",
    }),
  );
}

export async function updateEvent(id: string, data: UpdateEventInput): Promise<EventsApiState<Event>> {
  const eventId = id.trim();

  if (!eventId) {
    return createEventsFailure("Event id is required.", 400);
  }

  if (Object.keys(data).length === 0) {
    return createEventsFailure("At least one event field is required to update.", 400);
  }

  return executeEventsRequest(
    apiRequest<Event>(`${EVENTS_BASE_PATH}/${encodeURIComponent(eventId)}`, {
      body: data,
      method: "PATCH",
    }),
  );
}

export async function getEventMedia(eventId: string): Promise<EventsApiState<EventMedia[]>> {
  const normalizedEventId = eventId.trim();

  if (!normalizedEventId) {
    return createEventsFailure("Event id is required to load media.", 400);
  }

  return executeEventsRequest(
    apiRequest<EventMedia[]>(`${EVENTS_BASE_PATH}/${encodeURIComponent(normalizedEventId)}/media`, {
      method: "GET",
    }),
  );
}

export async function getEventGuests(eventId: string): Promise<EventsApiState<EventGuest[]>> {
  const normalizedEventId = eventId.trim();

  if (!normalizedEventId) {
    return createEventsFailure("Event id is required to load guests.", 400);
  }

  return executeEventsRequest(
    apiRequest<EventGuest[]>(`${EVENTS_BASE_PATH}/${encodeURIComponent(normalizedEventId)}/guests`, {
      method: "GET",
    }),
  );
}

export async function createEventGuest(data: CreateEventGuestInput): Promise<EventsApiState<EventGuest>> {
  if (!data.eventId.trim()) {
    return createEventsFailure("Event id is required to create a guest.", 400);
  }

  if (!data.name.trim()) {
    return createEventsFailure("Guest name is required.", 400);
  }

  return executeEventsRequest(
    apiRequest<EventGuest>(`${EVENTS_BASE_PATH}/${encodeURIComponent(data.eventId)}/guests`, {
      body: data,
      method: "POST",
    }),
  );
}

export async function getEventQRCode(eventId: string): Promise<EventsApiState<QRCode>> {
  const normalizedEventId = eventId.trim();

  if (!normalizedEventId) {
    return createEventsFailure("Event id is required to load a QR code.", 400);
  }

  return executeEventsRequest(
    apiRequest<QRCode>(`${EVENTS_BASE_PATH}/${encodeURIComponent(normalizedEventId)}/qr-code`, {
      method: "GET",
    }),
  );
}

export async function createEventQRCode(data: CreateQRCodeInput): Promise<EventsApiState<QRCode>> {
  if (!data.eventId.trim()) {
    return createEventsFailure("Event id is required to create a QR code.", 400);
  }

  return executeEventsRequest(
    apiRequest<QRCode>(`${EVENTS_BASE_PATH}/${encodeURIComponent(data.eventId)}/qr-code`, {
      body: data,
      method: "POST",
    }),
  );
}

async function executeEventsRequest<TData>(request: Promise<ApiResponse<TData>>): Promise<EventsApiState<TData>> {
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

function buildEventsEndpoint(path: string, filters: EventFilters) {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      params.set(key, String(value));
    }
  });

  const queryString = params.toString();
  return queryString ? `${EVENTS_BASE_PATH}${path}?${queryString}` : `${EVENTS_BASE_PATH}${path}`;
}

function validateCreateEventInput(data: CreateEventInput): EventsApiFailure | undefined {
  if (!data.tenantId.trim()) {
    return createEventsFailure("Tenant id is required.", 400);
  }

  if (!data.ownerId.trim()) {
    return createEventsFailure("Owner id is required.", 400);
  }

  if (!data.title.trim()) {
    return createEventsFailure("Event title is required.", 400);
  }

  if (!data.venue.trim()) {
    return createEventsFailure("Event venue is required.", 400);
  }

  if (!data.city.trim()) {
    return createEventsFailure("Event city is required.", 400);
  }

  if (!data.eventDate.trim()) {
    return createEventsFailure("Event date is required.", 400);
  }

  return undefined;
}

function createEventsFailure(message: string, status: number): EventsApiFailure {
  return {
    data: null,
    error: new ApiError(message, status),
    isLoading: false,
    status: "error",
  };
}

function toApiError(error: unknown) {
  if (error instanceof ApiError) {
    return error;
  }

  return new ApiError("Unexpected events API error.", 500);
}
