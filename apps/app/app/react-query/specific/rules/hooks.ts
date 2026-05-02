import { useQuery } from "@tanstack/react-query";
import { fetchRules, FetchRulesOptions } from "./fetch";
import { rulesKeys } from "../../query-keys";

export function useRules(options?: FetchRulesOptions) {
  return useQuery({
    queryKey: rulesKeys.all(options?.query, options?.limit),
    queryFn: () => fetchRules(options),
    staleTime: 1000 * 60 * 60,
  });
}
