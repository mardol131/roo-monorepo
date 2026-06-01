import { GetCollectionParams, PatchData } from "@/app/functions/api/general";
import type { Event } from "@roo/common";
import {
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { eventKeys } from "../query-keys";
import {
  addNoteToEvent,
  createEvent,
  fetchEventById,
  fetchEvents,
  patchEvent,
  updateChecklist,
} from "./fetch";

export function useEvents({
  options,
  enabled,
}: { options?: GetCollectionParams; enabled?: boolean } = {}) {
  return useQuery({
    queryKey: eventKeys.all(options?.query, options?.limit),
    queryFn: () => fetchEvents(options),
    enabled,
  });
}

export function useEvent(id: string | undefined) {
  return useQuery({
    queryKey: eventKeys.byId(id ?? ""),
    queryFn: () => fetchEventById(id!),
    enabled: !!id,
  });
}

type CreateEventData = Parameters<typeof createEvent>[0];

export function useCreateEvent(
  options?: UseMutationOptions<
    { doc: Event; message: string },
    Error,
    CreateEventData
  >,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateEventData) => {
      return createEvent(data);
    },
    onSuccess: (...arg) => {
      queryClient.invalidateQueries({ queryKey: eventKeys.all() });
      options?.onSuccess?.(...arg);
    },
  });
}

export function useAddEventNote(eventId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      note,
      description,
    }: {
      note: string;
      description?: string;
    }) => {
      const current = queryClient.getQueryData<Event>(eventKeys.byId(eventId));
      const existing = current?.notes ?? [];
      return addNoteToEvent(eventId, [
        ...existing,
        { note, description, createdAt: new Date().toISOString() },
      ]);
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

export function useUpdateEventNotes(eventId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notes: NonNullable<Event["notes"]>) =>
      addNoteToEvent(eventId, notes),
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

export type UpdateEvent = { id: string; data: PatchData<Event> };

export function useUpdateEvent({
  options,
}: {
  options?: UseMutationOptions<Event, Error, UpdateEvent>;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: UpdateEvent) => patchEvent(id, data),
    onSuccess: (data, variables, context, mutation) => {
      // Invaliduje detail listingu i seznam na dashboardu
      queryClient.invalidateQueries({ queryKey: eventKeys.byId(data.id) });
      queryClient.invalidateQueries({
        queryKey: eventKeys.byId(data.id),
      });
      options?.onSuccess?.(data, variables, context, mutation);
    },
    onError: (...args) => {
      options?.onError?.(...args);
    },
  });
}
