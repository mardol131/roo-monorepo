import { useQuery } from "@tanstack/react-query";
import { fetchPersonnel, FetchPersonnelOptions } from "./fetch";
import { personnelKeys } from "../../query-keys";

export function usePersonnel(options?: FetchPersonnelOptions) {
  return useQuery({
    queryKey: personnelKeys.all(options?.query, options?.limit),
    queryFn: () => fetchPersonnel(options),
    staleTime: 1000 * 60 * 60,
  });
}
