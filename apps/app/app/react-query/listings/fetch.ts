import {
  deleteCollectionItem,
  getCollection,
  getCollectionItem,
  patchCollectionItem,
  postCollectionItem,
} from "@/app/functions/api/general";
import { Listing } from "@roo/common";

export async function fetchAllListings() {
  const res = await getCollection({
    collection: "listings",
    sort: "-createdAt",
  });
  console.log("Fetched listings:", res);
  if (!res) throw new Error("Failed to fetch listings");
  return res;
}

export async function fetchListingsByCompany(companyId: string) {
  const res = await getCollection({
    collection: "listings",
    query: { company: { equals: companyId } },
    sort: "-createdAt",
  });
  console.log(`Fetched listings for company ${companyId}:`, res);
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
  "id" | "createdAt" | "updatedAt" | "status" | "slug"
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
