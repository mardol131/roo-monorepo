import { useQuery } from "@tanstack/react-query";
import { fetchDishTypes, FetchDishTypesOptions } from "./fetch";
import { dishTypesKeys } from "../../query-keys";

export function useDishTypes(options?: FetchDishTypesOptions) {
  return useQuery({
    queryKey: dishTypesKeys.all(options?.query, options?.limit),
    queryFn: () => fetchDishTypes(options),
    staleTime: 1000 * 60 * 60,
  });
}
