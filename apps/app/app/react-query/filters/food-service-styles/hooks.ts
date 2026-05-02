import { useQuery } from "@tanstack/react-query";
import {
  fetchFoodServiceStyles,
  FetchFoodServiceStylesOptions,
} from "./fetch";
import { foodServiceStylesKeys } from "../../query-keys";

export function useFoodServiceStyles(options?: FetchFoodServiceStylesOptions) {
  return useQuery({
    queryKey: foodServiceStylesKeys.all(options?.query, options?.limit),
    queryFn: () => fetchFoodServiceStyles(options),
    staleTime: 1000 * 60 * 60,
  });
}
