import { useQuery } from "@tanstack/react-query";
import { fetchTechnologies, FetchTechnologiesOptions } from "./fetch";
import { technologiesKeys } from "../../query-keys";

export function useTechnologies(options?: FetchTechnologiesOptions) {
  return useQuery({
    queryKey: technologiesKeys.all(options?.query, options?.limit),
    queryFn: () => fetchTechnologies(options),
    staleTime: 1000 * 60 * 60,
  });
}
