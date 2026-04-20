import { Listing } from "@roo/common";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { calendarEventKeys, inquiryKeys } from "../query-keys";
import {
  fetchCalendarEvent,
  fetchCalendarEventsByListing,
  updateInquiry,
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
