import { useQuery } from "@tanstack/react-query";
import {
  fetchEntertainmentTypes,
  FetchEntertainmentTypesOptions,
} from "./fetch";
import { entertainmentTypesKeys } from "../../query-keys";

export function useEntertainmentTypes(
  options?: FetchEntertainmentTypesOptions,
) {
  return useQuery({
    queryKey: entertainmentTypesKeys.all(options?.query, options?.limit),
    queryFn: () => fetchEntertainmentTypes(options),
    staleTime: 1000 * 60 * 60,
  });
}
