import {
  useQuery,
  useMutation,
  useQueryClient,
  UseMutationOptions,
} from "@tanstack/react-query";
import { Listing } from "@roo/common";
import { listingKeys, spaceKeys } from "../query-keys";
import {
  createListing,
  CreateListingPayload,
  deleteListing,
  fetchAllListings,
  fetchListing,
  fetchListingsByCompany,
  FetchListingsOptions,
  updateListing,
} from "./fetch";

export function useListings({
  options,
}: { options?: FetchListingsOptions } = {}) {
  return useQuery({
    queryKey: listingKeys.all(options?.query, options?.limit),
    queryFn: () => fetchAllListings(options),
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
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: listingKeys.byId(id ?? ""),
    queryFn: () => fetchListing(id!),
    enabled: !!id,
  });
}

export type UpdateListingData = Partial<Listing>;
export type UpdateListingVars = { id: string; data: UpdateListingData };

export function useUpdateListing(
  companyId: string,
  options?: UseMutationOptions<Listing, Error, UpdateListingVars>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: UpdateListingVars) => updateListing(id, data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: listingKeys.byId(args[1].id) });
      queryClient.invalidateQueries({
        queryKey: listingKeys.byCompany(companyId),
      });
      queryClient.invalidateQueries({
        queryKey: spaceKeys.byListing(args[0].id),
      });
      options?.onSuccess?.(...args);
    },
    onError: (...args) => {
      options?.onError?.(...args);
    },
  });
}

export function useDeleteListing(companyId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteListing(id),
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
    mutationFn: (data: CreateListingPayload) =>
      createListing(data).then((res) => res.doc),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: listingKeys.all() });
      queryClient.invalidateQueries({
        queryKey: listingKeys.byCompany(
          typeof args[0].company === "string"
            ? args[0].company
            : args[0].company.id,
        ),
      });
      options?.onSuccess?.(...args);
    },
    onError: (...args) => {
      options?.onError?.(...args);
    },
  });
}
