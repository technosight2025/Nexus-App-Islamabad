import { ApiError, type ApiResponse } from "@/lib/api/types";

type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";
type BookingPaymentStatus = "unpaid" | "deposit_pending" | "deposit_paid" | "paid" | "refunded";

interface MockBookingEventDetails {
  title: string;
  type: string;
  venue: string;
  city: string;
  guestCount?: number;
  notes?: string;
}

interface MockBookingPricingSummary {
  subtotal: number;
  platformFee: number;
  taxAmount: number;
  discountAmount: number;
  depositAmount: number;
  totalAmount: number;
  currency: "PKR";
}

interface MockBooking {
  id: string;
  tenantId: string;
  clientId: string;
  listingId: string;
  professionalId: string;
  serviceId: string;
  packageId?: string;
  eventDate: string;
  eventDetails: MockBookingEventDetails;
  pricing: MockBookingPricingSummary;
  status: BookingStatus;
  paymentStatus: BookingPaymentStatus;
  createdAt: string;
  updatedAt: string;
}

interface CreateBookingBody {
  tenantId: string;
  clientId: string;
  listingId: string;
  professionalId: string;
  serviceId: string;
  packageId?: string;
  eventDate: string;
  eventDetails: MockBookingEventDetails;
  pricing: MockBookingPricingSummary;
}

interface ConfirmBookingBody {
  bookingId: string;
  paymentIntentId?: string;
}

const now = "2026-06-16T00:00:00.000Z";

let bookings: MockBooking[] = [
  {
    id: "booking-001",
    tenantId: "tenant-nexus",
    clientId: "client-001",
    listingId: "lst-001",
    professionalId: "pro-001",
    serviceId: "svc-wedding-photo",
    packageId: "pkg-premium",
    eventDate: "2026-08-12T18:00:00.000Z",
    eventDetails: {
      title: "Khan Wedding Reception",
      type: "Wedding",
      venue: "Serena Hotel",
      city: "Islamabad",
      guestCount: 350,
      notes: "Client requested same-day highlights.",
    },
    pricing: {
      subtotal: 85000,
      platformFee: 4250,
      taxAmount: 0,
      discountAmount: 0,
      depositAmount: 25000,
      totalAmount: 89250,
      currency: "PKR",
    },
    status: "pending",
    paymentStatus: "deposit_pending",
    createdAt: now,
    updatedAt: now,
  },
];

export async function resolveMockBookingsRequest<TData>(
  path: string,
  method = "GET",
  body?: unknown,
): Promise<ApiResponse<TData> | undefined> {
  const url = new URL(path, "https://nexus.local");
  const pathname = url.pathname;

  if (!pathname.startsWith("/api/bookings")) {
    return undefined;
  }

  if (method === "GET" && pathname === "/api/bookings") {
    return asResponse<TData>(filterBookings(url.searchParams));
  }

  if (method === "POST" && pathname === "/api/bookings") {
    return asResponse<TData>(createBooking(body as CreateBookingBody));
  }

  if (method === "POST" && pathname === "/api/bookings/confirm") {
    return asResponse<TData>(confirmBooking(body as ConfirmBookingBody));
  }

  const bookingPathMatch = pathname.match(/^\/api\/bookings\/([^/]+)$/);

  if (!bookingPathMatch) {
    return undefined;
  }

  const bookingId = decodeURIComponent(bookingPathMatch[1]);

  if (method === "GET") {
    return asResponse<TData>(getBookingOrThrow(bookingId));
  }

  if (method === "PATCH") {
    return asResponse<TData>(updateBooking(bookingId, body as Partial<MockBooking>));
  }

  return undefined;
}

function filterBookings(params: URLSearchParams) {
  const clientId = normalizeText(params.get("clientId"));
  const professionalId = normalizeText(params.get("professionalId"));
  const listingId = normalizeText(params.get("listingId"));
  const status = normalizeText(params.get("status"));
  const fromDate = normalizeText(params.get("fromDate"));
  const toDate = normalizeText(params.get("toDate"));

  return bookings.filter((booking) => {
    const eventTimestamp = Date.parse(booking.eventDate);

    return (
      (clientId ? booking.clientId === clientId : true) &&
      (professionalId ? booking.professionalId === professionalId : true) &&
      (listingId ? booking.listingId === listingId : true) &&
      (status ? booking.status === status : true) &&
      (fromDate ? eventTimestamp >= Date.parse(fromDate) : true) &&
      (toDate ? eventTimestamp <= Date.parse(toDate) : true)
    );
  });
}

function createBooking(payload: CreateBookingBody) {
  const createdAt = new Date().toISOString();
  const booking: MockBooking = {
    ...payload,
    id: `booking-${String(bookings.length + 1).padStart(3, "0")}`,
    status: "pending",
    paymentStatus: payload.pricing.depositAmount > 0 ? "deposit_pending" : "unpaid",
    createdAt,
    updatedAt: createdAt,
  };

  bookings = [booking, ...bookings];
  return booking;
}

function getBookingOrThrow(bookingId: string) {
  const booking = bookings.find((item) => item.id === bookingId);

  if (!booking) {
    throw new ApiError("Booking not found.", 404, {
      message: "Booking not found.",
      code: "BOOKING_NOT_FOUND",
    });
  }

  return booking;
}

function updateBooking(bookingId: string, payload: Partial<MockBooking>) {
  const currentBooking = getBookingOrThrow(bookingId);
  const updatedBooking: MockBooking = {
    ...currentBooking,
    ...payload,
    eventDetails: {
      ...currentBooking.eventDetails,
      ...payload.eventDetails,
    },
    pricing: {
      ...currentBooking.pricing,
      ...payload.pricing,
    },
    id: currentBooking.id,
    updatedAt: new Date().toISOString(),
  };

  bookings = bookings.map((booking) => (booking.id === bookingId ? updatedBooking : booking));
  return updatedBooking;
}

function confirmBooking(payload: ConfirmBookingBody) {
  const currentBooking = getBookingOrThrow(payload.bookingId);

  return updateBooking(currentBooking.id, {
    paymentStatus: payload.paymentIntentId ? "deposit_paid" : currentBooking.paymentStatus,
    status: "confirmed",
  });
}

function asResponse<TData>(data: unknown): ApiResponse<TData> {
  return { data: data as TData };
}

function normalizeText(value: string | null) {
  const trimmedValue = value?.trim();
  return trimmedValue ? trimmedValue : undefined;
}
