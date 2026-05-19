import { useQuery } from "@tanstack/react-query";
import { filterOptionsKeys } from "../../query-keys";
import { fetchFilterOptions } from "./fetch";

export function useFilterOptions() {
  return useQuery({
    queryKey: filterOptionsKeys.all(),
    queryFn: fetchFilterOptions,
    staleTime: 1000 * 60 * 60,
  });
}
