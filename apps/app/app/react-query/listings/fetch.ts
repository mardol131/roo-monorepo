import {
  deleteCollectionItem,
  getCollection,
  getCollectionItem,
  GetCollectionItemOptions,
  GetCollectionParams,
  patchCollectionItem,
  PatchData,
  postCollectionItem,
} from "@/app/functions/api/general";
import {
  Listing,
  ListingEntertainmentDetail,
  ListingGastroDetail,
  ListingVenueDetail,
  LocalityType,
  Where,
  type AvailabilityStatus,
} from "@roo/common";

type ListingDetailCollectionMap = {
  "listing-venue-details": ListingVenueDetail;
  "listing-gastro-details": ListingGastroDetail;
  "listing-entertainment-details": ListingEntertainmentDetail;
};

export async function fetchAllListings(options?: GetCollectionParams) {
  const res = await getCollection({
    collection: "listings",
    ...options,
  });
  if (!res) throw new Error("Failed to fetch listings");
  return res;
}

export async function fetchListingsByCompany(
  companyId: string,
  options?: GetCollectionParams,
) {
  const companyFilter = { company: { equals: companyId } };
  const mergedQuery = options?.query
    ? { and: [companyFilter, options.query] }
    : companyFilter;
  const res = await getCollection({
    collection: "listings",
    ...options,
    query: mergedQuery,
  });
  if (!res) throw new Error("Failed to fetch listings");
  return res;
}

export async function fetchListing(
  id: string,
  options?: GetCollectionItemOptions,
): Promise<Listing> {
  const res = await getCollectionItem({
    collection: "listings",
    id,
    ...options,
  });
  if (!res) throw new Error("Failed to fetch listing");
  return res;
}

export async function updateListing(id: string, data: PatchData<Listing>) {
  const res = await patchCollectionItem({
    collection: "listings",
    id,
    data,
  });
  if (!res) throw new Error("Failed to update listing");
  return res;
}

export type CreateListingPayload = Omit<
  Listing,
  | "id"
  | "createdAt"
  | "updatedAt"
  | "status"
  | "slug"
  | "tariff"
  | "subscriptionStatus"
>;

export async function createListing(data: CreateListingPayload) {
  const res = await postCollectionItem({
    collection: "listings",
    data,
  });
  if (!res) throw new Error("Failed to create listing");
  return res;
}

export async function deleteListing(id: string) {
  const res = await deleteCollectionItem({
    collection: "listings",
    id,
  });

  if (!res) throw new Error("Failed to delete listing");
  return res;
}

// listing detail

export async function fetchListingDetail<
  C extends keyof ListingDetailCollectionMap,
>(collection: C, id: string): Promise<ListingDetailCollectionMap[C]> {
  const res = await getCollectionItem({ collection, id });
  if (!res) throw new Error("Failed to fetch listing detail");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return res as any;
}

export type UpdateListingDetailPayload<
  C extends keyof ListingDetailCollectionMap,
> = Partial<ListingDetailCollectionMap[C]>;

export async function updateListingDetail<
  C extends keyof ListingDetailCollectionMap,
>(
  collection: C,
  id: string,
  data: PatchData<ListingDetailCollectionMap[C]>,
): Promise<ListingDetailCollectionMap[C]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const res = await patchCollectionItem({ collection, id, data: data as any });
  if (!res) throw new Error("Failed to update listing detail");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return res as any;
}

export type CreateListingDetailPayload<
  C extends keyof ListingDetailCollectionMap,
> = Omit<
  ListingDetailCollectionMap[C],
  "id" | "createdAt" | "updatedAt" | "type"
>;

export async function createListingDetail<
  C extends keyof ListingDetailCollectionMap,
>(
  collection: C,
  data: CreateListingDetailPayload<C>,
): Promise<{ doc: ListingDetailCollectionMap[C]; message: string }> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const res = await postCollectionItem({ collection, data: data as any });
  if (!res) throw new Error("Failed to create listing detail");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return res as any;
}

export async function deleteListingDetail(
  collection: keyof ListingDetailCollectionMap,
  id: string,
) {
  const res = await deleteCollectionItem({ collection, id });
  if (!res) throw new Error("Failed to delete listing detail");
  return res;
}

export type MapPinItem = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  coverImage: string;
};

export type MapPinsResponse = {
  data: MapPinItem[];
};

export async function fetchListingPinsByLocationId(
  locationId: string,
  type: LocalityType,
): Promise<MapPinsResponse> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/listings/map-pins?id=${locationId}&type=${type}`,
    {
      method: "GET",
      credentials: "include",
    },
  );

  if (!res.ok) throw new Error("Failed to fetch listing pins");
  return res.json() as Promise<MapPinsResponse>;
}

export type GeoSearchParams = {
  type: "gastro" | "entertainment";
  city?: string;
  district?: string;
  region?: string;
  page?: number;
  limit?: number;
  where?: object;
};

export type GeoSearchResponse = {
  docs: Listing[];
  /** id → vzdálenost v km (zaokrouhlená na 2 desetinná místa) */
  distances: Record<string, number>;
  totalDocs: number;
  totalPages: number;
  page: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: number | null;
  prevPage: number | null;
};

export async function fetchGeoSearchListings(
  params: GeoSearchParams,
): Promise<GeoSearchResponse> {
  const urlParams = new URLSearchParams({
    type: params.type,
    page: String(params.page ?? 1),
    limit: String(params.limit ?? 12),
  });
  if (params.city) urlParams.set("city", params.city);
  if (params.district) urlParams.set("district", params.district);
  if (params.region) urlParams.set("region", params.region);
  if (params.where) urlParams.set("where", JSON.stringify(params.where));

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/listings/geo-search?${urlParams}`,
    { method: "GET", credentials: "include" },
  );
  if (!res.ok) throw new Error("Failed to fetch geo search listings");
  return res.json() as Promise<GeoSearchResponse>;
}

export type ListingsAvailabilityItem = {
  id: string;
  status: AvailabilityStatus;
};

export type ListingsAvailabilityResponse = {
  data: ListingsAvailabilityItem[];
};

export async function fetchListingsAvailability(
  ids: string[],
  from: string,
  to: string,
): Promise<ListingsAvailabilityResponse> {
  const params = new URLSearchParams({ ids: ids.join(","), from, to });
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/listings/listings-availability?${params}`,
    { method: "GET" },
  );
  if (!res.ok) throw new Error("Failed to fetch listings availability");
  return res.json() as Promise<ListingsAvailabilityResponse>;
}
