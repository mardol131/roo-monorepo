import {
  deleteCollectionItem,
  getCollection,
  getCollectionItem,
  GetCollectionParams,
  patchCollectionItem,
  postCollectionItem,
} from "@/app/functions/api/general";
import {
  Listing,
  ListingEntertainmentDetail,
  ListingGastroDetail,
  ListingVenueDetail,
  Where,
} from "@roo/common";

type ListingDetailCollectionMap = {
  "listing-venue-details": ListingVenueDetail;
  "listing-gastro-details": ListingGastroDetail;
  "listing-entertainment-details": ListingEntertainmentDetail;
};

export async function fetchAllListings(options?: GetCollectionParams) {
  const { query, limit, sort = "-createdAt", searchParams } = options || {};
  const res = await getCollection({
    collection: "listings",
    query,
    limit,
    sort,
    searchParams,
  });
  if (!res) throw new Error("Failed to fetch listings");
  return res;
}

export async function fetchListingsByCompany(
  companyId: string,
  headers?: Record<string, string>,
) {
  const res = await getCollection({
    collection: "listings",
    query: { company: { equals: companyId } },
    sort: "-createdAt",
    headers,
  });
  if (!res) throw new Error("Failed to fetch listings");
  return res;
}

export async function fetchListing(id: string): Promise<Listing> {
  const res = await getCollectionItem({
    collection: "listings",
    id,
  });
  if (!res) throw new Error("Failed to fetch listing");
  return res;
}

export async function updateListing(id: string, data: Partial<Listing>) {
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
  "id" | "createdAt" | "updatedAt" | "status" | "slug" | "tariff"
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
  data: Partial<ListingDetailCollectionMap[C]>,
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
