import { useQuery } from "@tanstack/react-query";
import { districtsKeys } from "../query-keys";
import { fetchDistricts } from "./fetch";
import { Where } from "@roo/common";

export function useDistricts(query?: Where, limit = 10) {
  return useQuery({
    queryKey: districtsKeys.all(query, limit),
    queryFn: () => fetchDistricts(query, limit),
  });
}
