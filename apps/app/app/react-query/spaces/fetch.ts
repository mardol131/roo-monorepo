import {
  getCollection,
  getCollectionItem,
  postCollectionItem,
} from "@/app/functions/api/general";
import { Space } from "@roo/common";

export async function fetchSpacesByListing(listingId: string) {
  const res = await getCollection({
    collection: "spaces",
    query: { listingId: { equals: listingId } },
    sort: "-createdAt",
  });
  if (!res) throw new Error("Failed to fetch spaces");
  return res;
}

export async function fetchSpace(id: string) {
  const res = await getCollectionItem({
    collection: "spaces",
    id,
  });
  if (!res) throw new Error("Failed to fetch space");
  return res;
}

export async function createSpace(
  input: Omit<Space, "id" | "createdAt" | "updatedAt">,
) {
  const res = await postCollectionItem({
    collection: "spaces",
    data: input,
  });
  if (!res) throw new Error("Failed to create space");

  return res;
}
