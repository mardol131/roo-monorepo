import { useQuery } from "@tanstack/react-query";
import { fetchCuisines, FetchCuisinesOptions } from "./fetch";
import { cuisinesKeys } from "../../query-keys";

export function useCuisines(options?: FetchCuisinesOptions) {
  return useQuery({
    queryKey: cuisinesKeys.all(options?.query, options?.limit),
    queryFn: () => fetchCuisines(options),
    staleTime: 1000 * 60 * 60,
  });
}
