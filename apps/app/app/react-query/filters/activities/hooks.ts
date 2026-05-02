import { useQuery } from "@tanstack/react-query";
import { fetchActivities, FetchActivitiesOptions } from "./fetch";
import { activitiesKeys } from "../../query-keys";

export function useActivities(options?: FetchActivitiesOptions) {
  return useQuery({
    queryKey: activitiesKeys.all(options?.query, options?.limit),
    queryFn: () => fetchActivities(options),
  });
}
