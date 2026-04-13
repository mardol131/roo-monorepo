import { useQuery } from "@tanstack/react-query";
import { spaceKeys } from "../query-keys";
import { fetchSpace, fetchSpacesByListing } from "./fetch";

export function useSpacesByListing(listingId: string) {
  return useQuery({
    queryKey: spaceKeys.byListing(listingId),
    queryFn: () => fetchSpacesByListing(listingId),
    enabled: !!listingId,
  });
}

export function useSpace(id: string) {
  return useQuery({
    queryKey: spaceKeys.byId(id),
    queryFn: () => fetchSpace(id),
    enabled: !!id,
  });
}
