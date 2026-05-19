import { Variant } from "@roo/common";
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
  patchVariant,
} from "./fetch";

export function useVariantsByListing(listingId: string) {
  return useQuery({
    queryKey: variantKeys.byListing(listingId),
    queryFn: () => fetchVariantsByListing(listingId),
    enabled: !!listingId,
  });
}

export function useVariant(id: string | undefined) {
  return useQuery({
    queryKey: variantKeys.byId(id ?? ""),
    queryFn: () => fetchVariant(id!),
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

export function useUpdateVariant(
  options?: UseMutationOptions<
    Variant,
    Error,
    { id: string; data: Partial<Variant> }
  >,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Variant> }) =>
      patchVariant(id, data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: variantKeys.byId(args[0].id),
      });
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
