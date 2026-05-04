import {
  deleteCollectionItem,
  getCollection,
  getCollectionItem,
  patchCollectionItem,
  postCollectionItem,
} from "@/app/functions/api/general";
import { Space } from "@roo/common";

export async function fetchSpacesByListing(listingId: string) {
  const res = await getCollection({
    collection: "spaces",
    query: { listing: { equals: listingId } },
    sort: "-createdAt",
    limit: 1000,
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

export type CreateSpaceInput = Omit<Space, "id" | "createdAt" | "updatedAt">;

export async function createSpace(input: CreateSpaceInput) {
  const res = await postCollectionItem({
    collection: "spaces",
    data: input,
  });
  if (!res) throw new Error("Failed to create space");
  return res;
}

export async function updateSpace(id: string, data: Partial<CreateSpaceInput>) {
  const res = await patchCollectionItem({
    collection: "spaces",
    id,
    data,
  });
  if (!res) throw new Error("Failed to update space");
  return res;
}

export async function deleteSpace(id: string) {
  const res = await deleteCollectionItem({
    collection: "spaces",
    id,
  });
  if (!res) throw new Error("Failed to delete space");
  return res;
}
