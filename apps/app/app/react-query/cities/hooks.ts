import { useQuery } from "@tanstack/react-query";
import { citiesKeys } from "../query-keys";
import { fetchCities } from "./fetch";
import { Where } from "@roo/common";

export function useCities(query?: Where, limit = 10) {
  return useQuery({
    queryKey: citiesKeys.all(query, limit),
    queryFn: () => fetchCities(query, limit),
  });
}
