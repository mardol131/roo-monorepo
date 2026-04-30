import { useQuery } from "@tanstack/react-query";
import { citiesKeys } from "../query-keys";
import { fetchCities, FetchCitiesOptions } from "./fetch";
import { Where } from "@roo/common";

export function useCities(options?: FetchCitiesOptions) {
  return useQuery({
    queryKey: citiesKeys.all(options?.query, options?.limit),
    queryFn: () => fetchCities(options),
  });
}
