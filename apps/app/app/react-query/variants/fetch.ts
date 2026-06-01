import {
  getCollection,
  GetCollectionParams,
  getCollectionItem,
  patchCollectionItem,
  postCollectionItem,
} from "@/app/functions/api/general";
import { PayloadResponse, Variant } from "@roo/common";

export async function fetchVariants(
  options?: GetCollectionParams,
): Promise<PayloadResponse<Variant>> {
  const res = await getCollection({ collection: "variants", ...options });
  if (!res) throw new Error("Failed to fetch variants");
  return res;
}

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
  "id" | "createdAt" | "updatedAt" | "status"
>;

export async function createVariant(data: CreateVariantPayload) {
  const res = await postCollectionItem({
    collection: "variants",
    data,
  });
  if (!res) throw new Error("Failed to create variant");
  return res.doc;
}

export async function patchVariant(id: string, data: Partial<Variant>) {
  const res = await patchCollectionItem({
    collection: "variants",
    id,
    data,
  });
  if (!res) throw new Error("Failed to update variant");
  return res;
}
