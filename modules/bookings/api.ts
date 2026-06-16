import { ApiError, apiRequest, type ApiResponse } from "@/lib/api";
import { zodErrorToFieldErrors } from "@/lib/api/contracts";
import {
  confirmBookingInputSchema,
  createBookingInputSchema,
  updateBookingInputSchema,
} from "@/modules/bookings/contracts";
import type {
  Booking,
  BookingFilters,
  ConfirmBookingInput,
  CreateBookingInput,
  UpdateBookingInput,
} from "@/modules/bookings/types";

const BOOKINGS_BASE_PATH = "/api/bookings";

export interface BookingsApiLoading {
  data: null;
  error: null;
  isLoading: true;
  status: "loading";
  meta?: undefined;
}

export interface BookingsApiSuccess<TData> extends ApiResponse<TData> {
  error: null;
  isLoading: false;
  status: "success";
}

export interface BookingsApiFailure {
  data: null;
  error: ApiError;
  isLoading: false;
  status: "error";
  meta?: undefined;
}

export type BookingsApiState<TData> = BookingsApiLoading | BookingsApiSuccess<TData> | BookingsApiFailure;

export function createBookingsLoadingState(): BookingsApiLoading {
  return {
    data: null,
    error: null,
    isLoading: true,
    status: "loading",
  };
}

export async function getBookings(filters: BookingFilters = {}): Promise<BookingsApiState<Booking[]>> {
  return executeBookingsRequest(
    apiRequest<Booking[]>(buildBookingsEndpoint("", filters), {
      method: "GET",
    }),
  );
}

export async function getBookingById(id: string): Promise<BookingsApiState<Booking>> {
  const bookingId = id.trim();

  if (!bookingId) {
    return createBookingsFailure("Booking id is required.", 400);
  }

  return executeBookingsRequest(
    apiRequest<Booking>(`${BOOKINGS_BASE_PATH}/${encodeURIComponent(bookingId)}`, {
      method: "GET",
    }),
  );
}

export async function createBooking(data: CreateBookingInput): Promise<BookingsApiState<Booking>> {
  const parsedInput = createBookingInputSchema.safeParse(data);

  if (!parsedInput.success) {
    return createBookingsValidationFailure("Invalid booking payload.", parsedInput.error);
  }

  return executeBookingsRequest(
    apiRequest<Booking>(BOOKINGS_BASE_PATH, {
      body: parsedInput.data,
      method: "POST",
    }),
  );
}

export async function updateBooking(id: string, data: UpdateBookingInput): Promise<BookingsApiState<Booking>> {
  const bookingId = id.trim();

  if (!bookingId) {
    return createBookingsFailure("Booking id is required.", 400);
  }

  const parsedInput = updateBookingInputSchema.safeParse(data);

  if (!parsedInput.success) {
    return createBookingsValidationFailure("Invalid booking update payload.", parsedInput.error);
  }

  return executeBookingsRequest(
    apiRequest<Booking>(`${BOOKINGS_BASE_PATH}/${encodeURIComponent(bookingId)}`, {
      body: parsedInput.data,
      method: "PATCH",
    }),
  );
}

export async function confirmBooking(data: ConfirmBookingInput): Promise<BookingsApiState<Booking>> {
  const parsedInput = confirmBookingInputSchema.safeParse(data);

  if (!parsedInput.success) {
    return createBookingsValidationFailure("Invalid booking confirmation payload.", parsedInput.error);
  }

  return executeBookingsRequest(
    apiRequest<Booking>(`${BOOKINGS_BASE_PATH}/confirm`, {
      body: parsedInput.data,
      method: "POST",
    }),
  );
}

async function executeBookingsRequest<TData>(
  request: Promise<ApiResponse<TData>>,
): Promise<BookingsApiState<TData>> {
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

function buildBookingsEndpoint(path: string, filters: BookingFilters) {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      params.set(key, String(value));
    }
  });

  const queryString = params.toString();
  return queryString ? `${BOOKINGS_BASE_PATH}${path}?${queryString}` : `${BOOKINGS_BASE_PATH}${path}`;
}

function createBookingsValidationFailure(message: string, error: Parameters<typeof zodErrorToFieldErrors>[0]) {
  const fieldErrors = zodErrorToFieldErrors(error).reduce<Record<string, string[]>>((accumulator, fieldError) => {
    accumulator[fieldError.field] = [...(accumulator[fieldError.field] ?? []), fieldError.message];
    return accumulator;
  }, {});

  return createBookingsFailure(message, 400, fieldErrors);
}

function createBookingsFailure(
  message: string,
  status: number,
  fieldErrors?: Record<string, string[]>,
): BookingsApiFailure {
  return {
    data: null,
    error: new ApiError(message, status, {
      code: fieldErrors ? "VALIDATION_ERROR" : "BAD_REQUEST",
      fieldErrors,
      message,
    }),
    isLoading: false,
    status: "error",
  };
}

function toApiError(error: unknown) {
  if (error instanceof ApiError) {
    return error;
  }

  return new ApiError("Unexpected bookings API error.", 500);
}
