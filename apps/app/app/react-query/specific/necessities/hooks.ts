import { useQuery } from "@tanstack/react-query";
import { fetchNecessities, FetchNecessitiesOptions } from "./fetch";
import { necessitiesKeys } from "../../query-keys";

export function useNecessities(options?: FetchNecessitiesOptions) {
  return useQuery({
    queryKey: necessitiesKeys.all(options?.query, options?.limit),
    queryFn: () => fetchNecessities(options),
    staleTime: 1000 * 60 * 60,
  });
}
