import { useQuery } from "@tanstack/react-query";
import { fetchEventTypes, FetchEventTypesOptions } from "./fetch";
import { eventTypesKeys } from "../../query-keys";

export function useEventTypes(options?: FetchEventTypesOptions) {
  return useQuery({
    queryKey: eventTypesKeys.all(options?.query, options?.limit),
    queryFn: () => fetchEventTypes(options),
    staleTime: 1000 * 60 * 60,
  });
}
