import { useQuery } from "@tanstack/react-query";
import { fetchRoomAmenities, FetchRoomAmenitiesOptions } from "./fetch";
import { roomAmenitiesKeys } from "../../query-keys";

export function useRoomAmenities(options?: FetchRoomAmenitiesOptions) {
  return useQuery({
    queryKey: roomAmenitiesKeys.all(options?.query, options?.limit),
    queryFn: () => fetchRoomAmenities(options),
    staleTime: 1000 * 60 * 60,
  });
}
