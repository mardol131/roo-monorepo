import {
  useQuery,
  useMutation,
  useQueryClient,
  UseMutationOptions,
} from "@tanstack/react-query";
import { Listing } from "@roo/common";
import { listingKeys } from "../query-keys";
import {
  createListing,
  CreateListingPayload,
  deleteListing,
  fetchAllListings,
  fetchListing,
  fetchListingsByCompany,
  updateListing,
} from "./fetch";

export function useListings() {
  return useQuery({
    queryKey: listingKeys.all(),
    queryFn: fetchAllListings,
  });
}

export function useListingsByCompany(companyId: string) {
  return useQuery({
    queryKey: listingKeys.byCompany(companyId),
    queryFn: () => fetchListingsByCompany(companyId),
    enabled: !!companyId,
  });
}

export function useListing(id: string | undefined) {
  return useQuery({
    queryKey: listingKeys.byId(id ?? ""),
    queryFn: () => fetchListing(id!),
    enabled: !!id,
  });
}

export function useUpdateListing(id: string, companyId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Listing>) => updateListing(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: listingKeys.byId(id) });
      queryClient.invalidateQueries({
        queryKey: listingKeys.byCompany(companyId),
      });
    },
  });
}

export function useDeleteListing(id: string, companyId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteListing(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: listingKeys.byCompany(companyId),
      });
    },
  });
}

export function useCreateListing(
  options?: UseMutationOptions<Listing, Error, CreateListingPayload>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateListingPayload) => createListing(data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: listingKeys.all() });
      queryClient.invalidateQueries({
        queryKey: listingKeys.byCompany(args[0].companyId),
      });
      options?.onSuccess?.(...args);
    },
    onError: (...args) => {
      options?.onError?.(...args);
    },
  });
}
