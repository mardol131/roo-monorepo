import {
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { variantKeys } from "../query-keys";
import {
  createVariant,
  CreateVariantPayload,
  fetchVariant,
  fetchVariantsByListing,
} from "./fetch";
import { Variant } from "@roo/common";
import { CreateListingPayload } from "../listings/fetch";

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

export function useCreateVariant(
  options?: UseMutationOptions<Variant, Error, CreateVariantPayload>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateVariantPayload) => createVariant(data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: variantKeys.byListing(
          typeof args[0].listing === "string"
            ? args[0].listing
            : args[0].listing.id,
        ),
      });
      options?.onSuccess?.(...args);
    },
  });
}
