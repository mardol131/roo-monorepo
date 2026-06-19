import { useQuery } from "@tanstack/react-query";
import { districtsKeys } from "../query-keys";
import { fetchDistricts } from "./fetch";
import { GetCollectionParams } from "@/app/functions/api/general";

export function useDistricts(
  options?: GetCollectionParams & { enabled?: boolean },
) {
  const { enabled, ...fetchOptions } = options ?? {};
  return useQuery({
    queryKey: districtsKeys.all(fetchOptions),
    queryFn: () => fetchDistricts(fetchOptions),
    enabled: enabled ?? true,
  });
}
