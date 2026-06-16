import type { ApiContractResponse, PaginatedApiContractResponse, PaginationParams } from "@/lib/api/contracts";

export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";
export type BookingPaymentStatus = "unpaid" | "deposit_pending" | "deposit_paid" | "paid" | "refunded";

export interface BookingEventDetails {
  title: string;
  type: string;
  venue: string;
  city: string;
  guestCount?: number;
  notes?: string;
}

export interface BookingPricingSummary {
  subtotal: number;
  platformFee: number;
  taxAmount: number;
  discountAmount: number;
  depositAmount: number;
  totalAmount: number;
  currency: "PKR";
}

export interface Booking {
  id: string;
  tenantId: string;
  clientId: string;
  listingId: string;
  professionalId: string;
  serviceId: string;
  packageId?: string;
  eventDate: string;
  eventDetails: BookingEventDetails;
  pricing: BookingPricingSummary;
  status: BookingStatus;
  paymentStatus: BookingPaymentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface BookingFilters extends PaginationParams {
  clientId?: string;
  professionalId?: string;
  listingId?: string;
  status?: BookingStatus;
  fromDate?: string;
  toDate?: string;
}

export interface CreateBookingInput {
  tenantId: string;
  clientId: string;
  listingId: string;
  professionalId: string;
  serviceId: string;
  packageId?: string;
  eventDate: string;
  eventDetails: BookingEventDetails;
  pricing: BookingPricingSummary;
}

export interface UpdateBookingInput {
  eventDate?: string;
  eventDetails?: Partial<BookingEventDetails>;
  pricing?: Partial<BookingPricingSummary>;
  status?: BookingStatus;
}

export interface ConfirmBookingInput {
  bookingId: string;
  paymentIntentId?: string;
}

export type BookingResponse = ApiContractResponse<Booking>;
export type BookingListResponse = PaginatedApiContractResponse<Booking>;
