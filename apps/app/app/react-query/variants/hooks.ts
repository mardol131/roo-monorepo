import { useQuery } from "@tanstack/react-query";
import { variantKeys } from "../query-keys";
import { fetchVariant, fetchVariantsByListing } from "./fetch";

export function useVariantsByListing(listingId: string) {
  return useQuery({
    queryKey: variantKeys.byListing(listingId),
    queryFn: () => fetchVariantsByListing(listingId),
    enabled: !!listingId,
  });
}

export function useVariant(id: string) {
  return useQuery({
    queryKey: variantKeys.byId(id),
    queryFn: () => fetchVariant(id),
    enabled: !!id,
  });
}
