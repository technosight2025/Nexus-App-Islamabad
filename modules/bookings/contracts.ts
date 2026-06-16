import { z } from "zod";
import {
  apiContractResponseSchema,
  paginatedApiContractResponseSchema,
  paginationParamsSchema,
} from "@/lib/api/contracts";

export const bookingStatusSchema = z.enum(["pending", "confirmed", "completed", "cancelled"]);
export const bookingPaymentStatusSchema = z.enum(["unpaid", "deposit_pending", "deposit_paid", "paid", "refunded"]);

export const bookingEventDetailsSchema = z.object({
  title: z.string().min(1, "Event title is required."),
  type: z.string().min(1, "Event type is required."),
  venue: z.string().min(1, "Venue is required."),
  city: z.string().min(1, "City is required."),
  guestCount: z.number().int().min(1).optional(),
  notes: z.string().max(2000).optional(),
});

export const bookingPricingSummarySchema = z.object({
  subtotal: z.number().nonnegative(),
  platformFee: z.number().nonnegative(),
  taxAmount: z.number().nonnegative(),
  discountAmount: z.number().nonnegative(),
  depositAmount: z.number().nonnegative(),
  totalAmount: z.number().nonnegative(),
  currency: z.literal("PKR"),
});

export const bookingSchema = z.object({
  id: z.string().min(1),
  tenantId: z.string().min(1),
  clientId: z.string().min(1),
  listingId: z.string().min(1),
  professionalId: z.string().min(1),
  serviceId: z.string().min(1),
  packageId: z.string().min(1).optional(),
  eventDate: z.string().datetime(),
  eventDetails: bookingEventDetailsSchema,
  pricing: bookingPricingSummarySchema,
  status: bookingStatusSchema,
  paymentStatus: bookingPaymentStatusSchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const bookingFiltersSchema = paginationParamsSchema.extend({
  clientId: z.string().min(1).optional(),
  professionalId: z.string().min(1).optional(),
  listingId: z.string().min(1).optional(),
  status: bookingStatusSchema.optional(),
  fromDate: z.string().datetime().optional(),
  toDate: z.string().datetime().optional(),
});

export const createBookingInputSchema = z.object({
  tenantId: z.string().min(1, "Tenant id is required."),
  clientId: z.string().min(1, "Client id is required."),
  listingId: z.string().min(1, "Listing id is required."),
  professionalId: z.string().min(1, "Professional id is required."),
  serviceId: z.string().min(1, "Service id is required."),
  packageId: z.string().min(1).optional(),
  eventDate: z.string().datetime("Event date must be a valid ISO datetime."),
  eventDetails: bookingEventDetailsSchema,
  pricing: bookingPricingSummarySchema,
});

export const updateBookingInputSchema = z
  .object({
    eventDate: z.string().datetime().optional(),
    eventDetails: bookingEventDetailsSchema.partial().optional(),
    pricing: bookingPricingSummarySchema.partial().optional(),
    status: bookingStatusSchema.optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one booking field is required to update.",
  });

export const confirmBookingInputSchema = z.object({
  bookingId: z.string().min(1, "Booking id is required."),
  paymentIntentId: z.string().min(1).optional(),
});

export const bookingResponseSchema = apiContractResponseSchema(bookingSchema);
export const bookingListResponseSchema = paginatedApiContractResponseSchema(bookingSchema);

export type BookingContract = z.infer<typeof bookingSchema>;
export type BookingFiltersContract = z.infer<typeof bookingFiltersSchema>;
export type CreateBookingInputContract = z.infer<typeof createBookingInputSchema>;
export type UpdateBookingInputContract = z.infer<typeof updateBookingInputSchema>;
export type ConfirmBookingInputContract = z.infer<typeof confirmBookingInputSchema>;
