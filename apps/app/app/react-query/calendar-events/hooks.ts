import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { calendarEventKeys } from "../query-keys";
import {
  createCalendarEvent,
  CreateCalendarEventInput,
  deleteCalendarEvent,
  fetchCalendarEvent,
  fetchCalendarEventsByListing,
  updateCalendarEvent,
  UpdateCalendarEventInput,
} from "./fetch";

export function useCalendarEventsByListing(listingId: string) {
  return useQuery({
    queryKey: calendarEventKeys.byListing(listingId),
    queryFn: () => fetchCalendarEventsByListing(listingId),
    enabled: !!listingId,
  });
}

export function useCalendarEvent(id: string) {
  return useQuery({
    queryKey: calendarEventKeys.byId(id),
    queryFn: () => fetchCalendarEvent(id),
    enabled: !!id,
  });
}

export function useCreateCalendarEvent(listingId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateCalendarEventInput) => createCalendarEvent(input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: calendarEventKeys.byListing(listingId),
      });
    },
  });
}

export function useUpdateCalendarEvent(listingId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateCalendarEventInput) => updateCalendarEvent(input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: calendarEventKeys.byListing(listingId),
      });
    },
  });
}

export function useDeleteCalendarEvent(listingId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteCalendarEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: calendarEventKeys.byListing(listingId),
      });
    },
  });
}
