import {
  confirmBooking as confirmBookingRequest,
  createBooking as createBookingRequest,
  getBookingById,
  getBookings,
  updateBooking as updateBookingRequest,
  type BookingsApiState,
} from "@/modules/bookings/api";
import type {
  Booking,
  BookingFilters,
  ConfirmBookingInput,
  CreateBookingInput,
  UpdateBookingInput,
} from "@/modules/bookings/types";

export const bookingsService = {
  async listBookings(filters: BookingFilters = {}): Promise<Booking[]> {
    return unwrapBookingsState(await getBookings(filters));
  },

  async getBooking(id: string): Promise<Booking> {
    return unwrapBookingsState(await getBookingById(id));
  },

  async createBooking(data: CreateBookingInput): Promise<Booking> {
    return unwrapBookingsState(await createBookingRequest(data));
  },

  async updateBooking(id: string, data: UpdateBookingInput): Promise<Booking> {
    return unwrapBookingsState(await updateBookingRequest(id, data));
  },

  async confirmBooking(data: ConfirmBookingInput): Promise<Booking> {
    return unwrapBookingsState(await confirmBookingRequest(data));
  },
};

function unwrapBookingsState<TData>(state: BookingsApiState<TData>): TData {
  if (state.status === "error") {
    throw state.error;
  }

  if (state.status === "loading") {
    throw new Error("Bookings API request is still loading.");
  }

  return state.data;
}
