export type EventStatus = "draft" | "scheduled" | "live" | "completed" | "cancelled";
export type EventGuestStatus = "invited" | "registered" | "checked_in" | "blocked";
export type EventMediaType = "image" | "video";
export type EventMediaStatus = "pending_review" | "approved" | "rejected";
export type QRCodeStatus = "active" | "paused" | "expired";

export interface Event {
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

export interface EventMedia {
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

export interface EventGuest {
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

export interface QRCode {
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

export interface EventFilters {
  query?: string;
  status?: EventStatus;
  city?: string;
  ownerId?: string;
}

export interface EventDetail {
  event: Event;
  guests: EventGuest[];
  media: EventMedia[];
  qrCode?: QRCode;
}

export interface CreateEventInput {
  tenantId: string;
  ownerId: string;
  title: string;
  description?: string;
  venue: string;
  city: string;
  eventDate: string;
  coverImageUrl?: string;
}

export type UpdateEventInput = Partial<
  Pick<Event, "title" | "description" | "venue" | "city" | "eventDate" | "status" | "coverImageUrl">
>;

export interface CreateEventGuestInput {
  eventId: string;
  name: string;
  email?: string;
  phone?: string;
}

export interface CreateQRCodeInput {
  eventId: string;
  expiresAt?: string;
}
