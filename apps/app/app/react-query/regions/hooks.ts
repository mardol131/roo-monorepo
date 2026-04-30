import { useQuery } from "@tanstack/react-query";
import { regionsKeys } from "../query-keys";
import { fetchRegions } from "./fetch";
import { Where } from "@roo/common";

export function useRegions(query?: Where, limit = 10) {
  return useQuery({
    queryKey: regionsKeys.all(query, limit),
    queryFn: () => fetchRegions(query, limit),
  });
}
