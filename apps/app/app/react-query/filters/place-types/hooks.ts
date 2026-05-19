import { useQuery } from "@tanstack/react-query";
import { fetchPlaceTypes, FetchPlaceTypesOptions } from "./fetch";
import { placeTypesKeys } from "../../query-keys";

export function usePlaceTypes(options?: FetchPlaceTypesOptions & { enabled?: boolean }) {
  return useQuery({
    queryKey: placeTypesKeys.all(options?.query, options?.limit),
    queryFn: () => fetchPlaceTypes(options),
    staleTime: 1000 * 60 * 60,
    enabled: options?.enabled ?? true,
  });
}
