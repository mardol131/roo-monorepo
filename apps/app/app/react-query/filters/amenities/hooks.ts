import { useQuery } from "@tanstack/react-query";
import { fetchAmenities, FetchAmenitiesOptions } from "./fetch";
import { amenitiesKeys } from "../../query-keys";

export function useAmenities(options?: FetchAmenitiesOptions) {
  return useQuery({
    queryKey: amenitiesKeys.all(options?.query, options?.limit),
    queryFn: () => fetchAmenities(options),
    staleTime: 1000 * 60 * 60,
  });
}
