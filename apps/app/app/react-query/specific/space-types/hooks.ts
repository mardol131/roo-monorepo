import { useQuery } from "@tanstack/react-query";
import { spaceTypesKeys } from "../../query-keys";
import { fetchSpaceTypes, FetchSpaceTypesOptions } from "./fetch";

export function useSpaceTypes(options?: FetchSpaceTypesOptions) {
  return useQuery({
    queryKey: spaceTypesKeys.all(options?.query, options?.limit),
    queryFn: () => fetchSpaceTypes(options),
    staleTime: 1000 * 60 * 60,
  });
}
