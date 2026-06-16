import { ApiError, type ApiResponse } from "@/lib/api/types";

type EventStatus = "draft" | "scheduled" | "live" | "completed" | "cancelled";
type EventGuestStatus = "invited" | "registered" | "checked_in" | "blocked";
type EventMediaType = "image" | "video";
type EventMediaStatus = "pending_review" | "approved" | "rejected";
type QRCodeStatus = "active" | "paused" | "expired";

interface MockEvent {
  id: string;
  tenantId: string;
  ownerId: string;
  title: string;
  description?: string;
  venue: string;
  city: string;
  eventDate: string;
  status: EventStatus;
  coverImageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

interface MockEventMedia {
  id: string;
  eventId: string;
  uploaderId?: string;
  guestId?: string;
  url: string;
  thumbnailUrl?: string;
  type: EventMediaType;
  caption?: string;
  status: EventMediaStatus;
  createdAt: string;
  updatedAt: string;
}

interface MockEventGuest {
  id: string;
  eventId: string;
  name: string;
  email?: string;
  phone?: string;
  status: EventGuestStatus;
  checkedInAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface MockQRCode {
  id: string;
  eventId: string;
  token: string;
  uploadUrl: string;
  imageUrl?: string;
  status: QRCodeStatus;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface MockEventDetail {
  event: MockEvent;
  guests: MockEventGuest[];
  media: MockEventMedia[];
  qrCode?: MockQRCode;
}

interface CreateEventBody {
  tenantId: string;
  ownerId: string;
  title: string;
  description?: string;
  venue: string;
  city: string;
  eventDate: string;
  coverImageUrl?: string;
}

interface CreateQRCodeBody {
  eventId: string;
  expiresAt?: string;
}

interface UploadMediaBody {
  eventId: string;
  uploaderId?: string;
  guestId?: string;
  url: string;
  thumbnailUrl?: string;
  type: EventMediaType;
  caption?: string;
}

const now = "2026-06-16T00:00:00.000Z";

let events: MockEvent[] = [
  {
    id: "evt-001",
    tenantId: "tenant-nexus",
    ownerId: "pro-001",
    title: "Khan Wedding Reception",
    description: "Guest media uploads and live memories gallery.",
    venue: "Serena Hotel",
    city: "Islamabad",
    eventDate: "2026-08-12T18:00:00.000Z",
    status: "scheduled",
    createdAt: now,
    updatedAt: now,
  },
];

let media: MockEventMedia[] = [];
const guests: MockEventGuest[] = [
  {
    id: "guest-001",
    eventId: "evt-001",
    name: "Ayesha Khan",
    email: "ayesha@example.com",
    status: "registered",
    createdAt: now,
    updatedAt: now,
  },
];
let qrCodes: MockQRCode[] = [
  {
    id: "qr-001",
    eventId: "evt-001",
    token: "evt-001-upload",
    uploadUrl: "https://nexus.local/memories/evt-001-upload",
    status: "active",
    createdAt: now,
    updatedAt: now,
  },
];

export async function resolveMockEventsRequest<TData>(
  path: string,
  method = "GET",
  body?: unknown,
): Promise<ApiResponse<TData> | undefined> {
  const url = new URL(path, "https://nexus.local");
  const pathname = url.pathname;

  if (!pathname.startsWith("/api/events")) {
    return undefined;
  }

  if (method === "GET" && pathname === "/api/events") {
    return asResponse<TData>(filterEvents(url.searchParams));
  }

  if (method === "POST" && pathname === "/api/events") {
    return asResponse<TData>(createEvent(body as CreateEventBody));
  }

  const eventPathMatch = pathname.match(/^\/api\/events\/([^/]+)(?:\/([^/]+))?$/);

  if (!eventPathMatch) {
    return undefined;
  }

  const eventId = decodeURIComponent(eventPathMatch[1]);
  const childResource = eventPathMatch[2];

  if (method === "GET" && !childResource) {
    return asResponse<TData>(getEventDetail(eventId));
  }

  if (method === "PATCH" && !childResource) {
    return asResponse<TData>(updateEvent(eventId, body as Partial<MockEvent>));
  }

  if (method === "GET" && childResource === "media") {
    return asResponse<TData>(media.filter((item) => item.eventId === eventId));
  }

  if (method === "POST" && childResource === "media") {
    return asResponse<TData>(uploadMedia(eventId, body as UploadMediaBody));
  }

  if (method === "GET" && childResource === "guests") {
    return asResponse<TData>(guests.filter((guest) => guest.eventId === eventId));
  }

  if (method === "GET" && childResource === "qr-code") {
    const qrCode = qrCodes.find((item) => item.eventId === eventId);

    if (!qrCode) {
      throw new ApiError("QR code not found.", 404, {
        message: "QR code not found.",
        code: "EVENT_QR_CODE_NOT_FOUND",
      });
    }

    return asResponse<TData>(qrCode);
  }

  if (method === "POST" && childResource === "qr-code") {
    return asResponse<TData>(generateQRCode(eventId, body as CreateQRCodeBody));
  }

  return undefined;
}

function filterEvents(params: URLSearchParams) {
  const query = normalizeText(params.get("query"));
  const status = normalizeText(params.get("status"));
  const city = normalizeText(params.get("city"));
  const ownerId = normalizeText(params.get("ownerId"));

  return events.filter((event) => {
    const matchesQuery = query
      ? [event.title, event.description, event.venue, event.city]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(query.toLowerCase())
      : true;

    return (
      matchesQuery &&
      (status ? event.status === status : true) &&
      (city ? event.city.toLowerCase() === city.toLowerCase() : true) &&
      (ownerId ? event.ownerId === ownerId : true)
    );
  });
}

function createEvent(payload: CreateEventBody) {
  const createdAt = new Date().toISOString();
  const event: MockEvent = {
    ...payload,
    id: `evt-${String(events.length + 1).padStart(3, "0")}`,
    status: "scheduled",
    createdAt,
    updatedAt: createdAt,
  };

  events = [event, ...events];
  return event;
}

function getEventOrThrow(eventId: string) {
  const event = events.find((item) => item.id === eventId);

  if (!event) {
    throw new ApiError("Event not found.", 404, {
      message: "Event not found.",
      code: "EVENT_NOT_FOUND",
    });
  }

  return event;
}

function getEventDetail(eventId: string): MockEventDetail {
  const event = getEventOrThrow(eventId);

  return {
    event,
    guests: guests.filter((guest) => guest.eventId === eventId),
    media: media.filter((item) => item.eventId === eventId),
    qrCode: qrCodes.find((qrCode) => qrCode.eventId === eventId),
  };
}

function updateEvent(eventId: string, payload: Partial<MockEvent>) {
  const currentEvent = getEventOrThrow(eventId);
  const updatedEvent: MockEvent = {
    ...currentEvent,
    ...payload,
    id: currentEvent.id,
    updatedAt: new Date().toISOString(),
  };

  events = events.map((event) => (event.id === eventId ? updatedEvent : event));
  return updatedEvent;
}

function uploadMedia(eventId: string, payload: UploadMediaBody) {
  getEventOrThrow(eventId);

  const createdAt = new Date().toISOString();
  const uploadedMedia: MockEventMedia = {
    ...payload,
    eventId,
    id: `media-${String(media.length + 1).padStart(3, "0")}`,
    status: "pending_review",
    createdAt,
    updatedAt: createdAt,
  };

  media = [uploadedMedia, ...media];
  return uploadedMedia;
}

function generateQRCode(eventId: string, payload: CreateQRCodeBody) {
  getEventOrThrow(eventId);

  const createdAt = new Date().toISOString();
  const token = `${eventId}-${Date.now()}`;
  const qrCode: MockQRCode = {
    id: `qr-${String(qrCodes.length + 1).padStart(3, "0")}`,
    eventId,
    token,
    uploadUrl: `https://nexus.local/memories/${token}`,
    status: "active",
    expiresAt: payload.expiresAt,
    createdAt,
    updatedAt: createdAt,
  };

  qrCodes = [qrCode, ...qrCodes.filter((item) => item.eventId !== eventId)];
  return qrCode;
}

function asResponse<TData>(data: unknown): ApiResponse<TData> {
  return { data: data as TData };
}

function normalizeText(value: string | null) {
  const trimmedValue = value?.trim();
  return trimmedValue ? trimmedValue : undefined;
}
