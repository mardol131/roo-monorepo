import { useQuery } from "@tanstack/react-query";
import { regionsKeys } from "../query-keys";
import { fetchRegions } from "./fetch";
import { GetCollectionParams } from "@/app/functions/api/general";

export function useRegions(
  options?: GetCollectionParams & { enabled?: boolean },
) {
  const { enabled, ...fetchOptions } = options ?? {};
  return useQuery({
    queryKey: regionsKeys.all(fetchOptions),
    queryFn: () => fetchRegions(fetchOptions),
    enabled: enabled ?? true,
  });
}
