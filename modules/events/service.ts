import {
  createEvent,
  createEventGuest,
  generateQRCode as generateQRCodeRequest,
  getEventById,
  getEventGuests,
  getEventMedia,
  getEventQRCode,
  getEvents,
  updateEvent,
  uploadMedia as uploadMediaRequest,
  type EventsApiState,
} from "@/modules/events/api";
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
  UploadMediaInput,
} from "@/modules/events/types";

export const eventsService = {
  async listEvents(filters: EventFilters = {}): Promise<Event[]> {
    return unwrapEventsState(await getEvents(filters));
  },

  async createEvent(data: CreateEventInput): Promise<Event> {
    return unwrapEventsState(await createEvent(data));
  },

  async getEvent(id: string): Promise<EventDetail> {
    return unwrapEventsState(await getEventById(id));
  },

  async updateEvent(id: string, data: UpdateEventInput): Promise<Event> {
    return unwrapEventsState(await updateEvent(id, data));
  },

  async listEventMedia(eventId: string): Promise<EventMedia[]> {
    return unwrapEventsState(await getEventMedia(eventId));
  },

  async uploadMedia(data: UploadMediaInput): Promise<EventMedia> {
    return unwrapEventsState(await uploadMediaRequest(data));
  },

  async listEventGuests(eventId: string): Promise<EventGuest[]> {
    return unwrapEventsState(await getEventGuests(eventId));
  },

  async createEventGuest(data: CreateEventGuestInput): Promise<EventGuest> {
    return unwrapEventsState(await createEventGuest(data));
  },

  async getEventQRCode(eventId: string): Promise<QRCode> {
    return unwrapEventsState(await getEventQRCode(eventId));
  },

  async generateQRCode(data: CreateQRCodeInput): Promise<QRCode> {
    return unwrapEventsState(await generateQRCodeRequest(data));
  },
};

function unwrapEventsState<TData>(state: EventsApiState<TData>): TData {
  if (state.status === "error") {
    throw state.error;
  }

  if (state.status === "loading") {
    throw new Error("Events API request is still loading.");
  }

  return state.data;
}
