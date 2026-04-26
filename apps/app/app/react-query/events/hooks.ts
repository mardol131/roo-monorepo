import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Event } from "@roo/common";
import { eventKeys } from "../query-keys";
import { addNoteToEvent, fetchEventById, fetchEvents, updateChecklist } from "./fetch";

export function useEvents() {
  return useQuery({
    queryKey: eventKeys.all(),
    queryFn: () => fetchEvents(),
  });
}

export function useEvent(id: string) {
  return useQuery({
    queryKey: eventKeys.byId(id),
    queryFn: () => fetchEventById(id),
  });
}

export function useAddEventNote(eventId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (note: string) => {
      const current = queryClient.getQueryData<Event>(eventKeys.byId(eventId));
      const existing = current?.notes ?? [];
      return addNoteToEvent(eventId, [...existing, { note }]);
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(eventKeys.byId(eventId), updated);
    },
  });
}

export function useRemoveEventNote(eventId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (noteId: string) => {
      const current = queryClient.getQueryData<Event>(eventKeys.byId(eventId));
      const updated = (current?.notes ?? []).filter((n) => n.id !== noteId);
      return addNoteToEvent(eventId, updated);
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(eventKeys.byId(eventId), updated);
    },
  });
}

export function useUpdateChecklist(eventId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (checklist: NonNullable<Event["checklist"]>) =>
      updateChecklist(eventId, checklist),
    onSuccess: (updated) => {
      queryClient.setQueryData(eventKeys.byId(eventId), updated);
    },
  });
}
