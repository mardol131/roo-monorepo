import { useQuery } from "@tanstack/react-query";
import { citiesKeys } from "../query-keys";
import { fetchCities, fetchCity } from "./fetch";
import { GetCollectionParams } from "@/app/functions/api/general";

export function useCities(
  options?: GetCollectionParams & { enabled?: boolean },
) {
  const { enabled, ...fetchOptions } = options ?? {};
  return useQuery({
    queryKey: citiesKeys.all(fetchOptions),
    queryFn: () => fetchCities(fetchOptions),
    enabled: enabled ?? true,
  });
}

export function useCity(id: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: citiesKeys.byId(id),
    queryFn: () => fetchCity(id),
    enabled: options?.enabled ?? true,
  });
}
