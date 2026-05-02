import { useQuery } from "@tanstack/react-query";
import { fetchServices, FetchServicesOptions } from "./fetch";
import { servicesKeys } from "../../query-keys";

export function useServices(options?: FetchServicesOptions) {
  return useQuery({
    queryKey: servicesKeys.all(options?.query, options?.limit),
    queryFn: () => fetchServices(options),
    staleTime: 1000 * 60 * 60,
  });
}
