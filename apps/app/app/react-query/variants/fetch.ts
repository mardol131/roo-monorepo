import {
  getCollection,
  getCollectionItem,
  postCollectionItem,
} from "@/app/functions/api/general";
import { PayloadResponse, Variant } from "@roo/common";
import { CreateListingPayload } from "../listings/fetch";

export async function fetchVariantsByListing(
  listingId: string,
): Promise<PayloadResponse<Variant>> {
  const res = await getCollection({
    collection: "variants",
    query: { listing: { equals: listingId } },
  });
  if (!res) throw new Error("Failed to fetch variants");
  return res;
}

export async function fetchVariant(id: string) {
  const res = await getCollectionItem({
    collection: "variants",
    id,
  });
  if (!res) throw new Error("Failed to fetch variant");
  return res;
}

export type CreateVariantPayload = Omit<
  Variant,
  "id" | "createdAt" | "updatedAt"
>;

export async function createVariant(data: CreateVariantPayload) {
  const res = await postCollectionItem({
    collection: "variants",
    data,
  });
  console.log("Created variant:", res);
  if (!res) throw new Error("Failed to create variant");
  return res.doc;
}
