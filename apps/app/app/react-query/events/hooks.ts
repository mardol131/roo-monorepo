import { useQuery } from "@tanstack/react-query";
import { eventKeys } from "../query-keys";
import { fetchEventById, fetchEvents } from "./fetch";

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
