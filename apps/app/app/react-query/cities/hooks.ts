import { useQuery } from "@tanstack/react-query";
import { citiesKeys } from "../query-keys";
import { fetchCities, FetchCitiesOptions, fetchCity } from "./fetch";

export function useCities(
  options?: FetchCitiesOptions & { enabled?: boolean },
) {
  return useQuery({
    queryKey: citiesKeys.all(options?.query, options?.limit),
    queryFn: () => fetchCities(options),
    enabled: options?.enabled ?? true,
  });
}

export function useCity(id: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: citiesKeys.byId(id),
    queryFn: () => fetchCity(id),
    enabled: options?.enabled ?? true,
  });
}
