import { useQuery } from "@tanstack/react-query";
import { fetchDietaryOptions, FetchDietaryOptionsOptions } from "./fetch";
import { dietaryOptionsKeys } from "../../query-keys";

export function useDietaryOptions(options?: FetchDietaryOptionsOptions) {
  return useQuery({
    queryKey: dietaryOptionsKeys.all(options?.query, options?.limit),
    queryFn: () => fetchDietaryOptions(options),
    staleTime: 1000 * 60 * 60,
  });
}
