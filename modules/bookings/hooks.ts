import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { bookingsService } from "@/modules/bookings/service";
import type {
  BookingFilters,
  ConfirmBookingInput,
  CreateBookingInput,
  UpdateBookingInput,
} from "@/modules/bookings/types";

interface UpdateBookingVariables {
  id: string;
  data: UpdateBookingInput;
}

export const bookingsQueryKeys = {
  all: ["bookings"] as const,
  lists: () => [...bookingsQueryKeys.all, "list"] as const,
  list: (filters: BookingFilters = {}) => [...bookingsQueryKeys.lists(), filters] as const,
  detail: (id: string) => [...bookingsQueryKeys.all, "detail", id] as const,
};

export const bookingsQueryOptions = {
  list: (filters: BookingFilters = {}) =>
    queryOptions({
      queryKey: bookingsQueryKeys.list(filters),
      queryFn: () => bookingsService.listBookings(filters),
    }),
  detail: (id: string) =>
    queryOptions({
      queryKey: bookingsQueryKeys.detail(id),
      queryFn: () => bookingsService.getBooking(id),
      enabled: id.trim().length > 0,
    }),
};

export function useBookings(filters: BookingFilters = {}) {
  return useQuery(bookingsQueryOptions.list(filters));
}

export function useBooking(id = "") {
  return useQuery(bookingsQueryOptions.detail(id));
}

export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBookingInput) => bookingsService.createBooking(data),
    onSuccess: async (booking) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: bookingsQueryKeys.lists() }),
        queryClient.invalidateQueries({ queryKey: bookingsQueryKeys.detail(booking.id) }),
      ]);
    },
  });
}

export function useUpdateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: UpdateBookingVariables) => bookingsService.updateBooking(id, data),
    onSuccess: async (booking) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: bookingsQueryKeys.lists() }),
        queryClient.invalidateQueries({ queryKey: bookingsQueryKeys.detail(booking.id) }),
      ]);
    },
  });
}

export function useConfirmBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ConfirmBookingInput) => bookingsService.confirmBooking(data),
    onSuccess: async (booking) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: bookingsQueryKeys.lists() }),
        queryClient.invalidateQueries({ queryKey: bookingsQueryKeys.detail(booking.id) }),
      ]);
    },
  });
}
