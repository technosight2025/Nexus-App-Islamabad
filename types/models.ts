export type UserRole = "client" | "professional" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Listing {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  category: string;
  city: string;
  basePrice: number;
  currency: "PKR";
  coverImageUrl?: string;
  status: "draft" | "pending_review" | "approved" | "rejected";
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: string;
  listingId: string;
  clientId: string;
  professionalId: string;
  eventDate: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  totalAmount: number;
  currency: "PKR";
  createdAt: string;
  updatedAt: string;
}

export interface Event {
  id: string;
  ownerId: string;
  bookingId?: string;
  title: string;
  venue: string;
  eventDate: string;
  qrCodeUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Media {
  id: string;
  eventId: string;
  uploaderId?: string;
  url: string;
  type: "image" | "video";
  caption?: string;
  createdAt: string;
}
