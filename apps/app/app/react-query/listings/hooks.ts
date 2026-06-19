import {
  useQuery,
  useMutation,
  useQueryClient,
  UseMutationOptions,
} from "@tanstack/react-query";
import {
  getIdFromRelationshipField,
  Listing,
  ListingEntertainmentDetail,
  ListingGastroDetail,
  ListingVenueDetail,
  LocalityType,
} from "@roo/common";
import { listingDetailKeys, listingKeys, spaceKeys } from "../query-keys";
import {
  createListing,
  CreateListingPayload,
  createListingDetail,
  deleteListing,
  deleteListingDetail,
  fetchAllListings,
  fetchGeoSearchListings,
  fetchListing,
  fetchListingDetail,
  fetchListingsByCompany,
  GeoSearchParams,
  updateListing,
  updateListingDetail,
  CreateListingDetailPayload,
  fetchListingPinsByLocationId,
  fetchListingsAvailability,
} from "./fetch";
import {
  GetCollectionItemOptions,
  GetCollectionParams,
  PatchData,
} from "@/app/functions/api/general";
import { LocationType } from "@/app/components/ui/atoms/inputs/location-input";

export type ListingDetailCollectionMap = {
  "listing-venue-details": ListingVenueDetail;
  "listing-gastro-details": ListingGastroDetail;
  "listing-entertainment-details": ListingEntertainmentDetail;
};

export function useListings({
  options,
  enabled,
}: { options?: GetCollectionParams; enabled?: boolean } = {}) {
  return useQuery({
    queryKey: listingKeys.all(options),
    queryFn: () => fetchAllListings(options),
    enabled,
  });
}

export function useListingsByCompany(
  companyId: string,
  options?: GetCollectionParams,
) {
  return useQuery({
    queryKey: listingKeys.byCompany(companyId, options?.query, options?.limit),
    queryFn: () => fetchListingsByCompany(companyId, options),
    enabled: !!companyId,
  });
}

export function useListing(
  id: string | undefined,
  options?: GetCollectionItemOptions,
) {
  return useQuery({
    queryKey: listingKeys.byId(id ?? ""),
    queryFn: () => fetchListing(id!, options),
    enabled: !!id,
  });
}

export type UpdateListingData = Omit<
  Partial<Listing>,
  "filters" | "options"
> & {
  filters?: Partial<Listing["filters"]>;
  options?: Partial<Listing["options"]>;
};
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
          getIdFromRelationshipField(args[0].company),
        ),
      });
      options?.onSuccess?.(...args);
    },
    onError: (...args) => {
      options?.onError?.(...args);
    },
  });
}

// listing detail hooks

export function useListingDetail<C extends keyof ListingDetailCollectionMap>(
  collection: C,
  id: string | undefined,
) {
  return useQuery({
    queryKey: listingDetailKeys.byId(collection, id ?? ""),
    queryFn: () => fetchListingDetail(collection, id!),
    enabled: !!id,
  });
}

export function useUpdateListingDetail<
  C extends keyof ListingDetailCollectionMap,
>(
  collection: C,
  options?: UseMutationOptions<
    ListingDetailCollectionMap[C],
    Error,
    { id: string; data: PatchData<ListingDetailCollectionMap[C]> }
  >,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: PatchData<ListingDetailCollectionMap[C]>;
    }) => updateListingDetail(collection, id, data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: listingDetailKeys.byId(collection, args[1].id),
      });
      options?.onSuccess?.(...args);
    },
    onError: (...args) => {
      options?.onError?.(...args);
    },
  });
}

export function useCreateListingDetail<
  C extends keyof ListingDetailCollectionMap,
>(
  collection: C,
  options?: UseMutationOptions<
    { doc: ListingDetailCollectionMap[C]; message: string },
    Error,
    CreateListingDetailPayload<C>
  >,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateListingDetailPayload<C>) =>
      createListingDetail(collection, data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: listingDetailKeys.byId(collection, args[0].doc.id),
      });
      options?.onSuccess?.(...args);
    },
    onError: (...args) => {
      options?.onError?.(...args);
    },
  });
}

export function useDeleteListingDetail<
  C extends keyof ListingDetailCollectionMap,
>(collection: C) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteListingDetail(collection, id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: listingDetailKeys.byId(collection, id),
      });
    },
  });
}

export function useGeoSearchListings(
  params: GeoSearchParams & { enabled?: boolean },
) {
  const { enabled = true, ...fetchParams } = params;
  return useQuery({
    queryKey: listingKeys.geoSearch(fetchParams as Record<string, unknown>),
    queryFn: () => fetchGeoSearchListings(fetchParams),
    enabled,
  });
}

export function useListingPinsByLocationId(
  locationId: string,
  type: LocalityType,
) {
  return useQuery({
    queryKey: listingKeys.pinsByLocation(locationId, type),
    queryFn: () => fetchListingPinsByLocationId(locationId, type),
  });
}

type UseListingsAvailabilityParams = {
  ids: string[];
  from: string;
  to: string;
  enabled?: boolean;
};

export function useListingsAvailability({
  ids,
  from,
  to,
  enabled = true,
}: UseListingsAvailabilityParams) {
  return useQuery({
    queryKey: listingKeys.availability(ids, from, to),
    queryFn: () => fetchListingsAvailability(ids, from, to),
    enabled: enabled && ids.length > 0 && !!from && !!to,
  });
}
