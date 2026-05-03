import {
  getCollection,
  patchCollectionItem,
} from "@/app/functions/api/general";
import { Inquiry, Listing } from "@roo/common";

export async function fetchInquiriesByListing(listingId: string) {
  const res = await getCollection({
    collection: "inquiries",
    query: { listingId: { equals: listingId } },
  });
  if (!res) throw new Error("Failed to fetch inquiries");
  return res;
}

export async function fetchInquiries() {
  const res = await getCollection({
    collection: "inquiries",
  });
  if (!res) throw new Error("Failed to fetch inquiries");
  return res;
}

export async function fetchInquiry(id: string) {
  const res = await getCollection({
    collection: "inquiries",
    query: { id: { equals: id } },
  });
  if (!res) throw new Error("Failed to fetch inquiry");
  return res;
}

export async function updateInquiry(id: string, data: Partial<Inquiry>) {
  const res = await patchCollectionItem({
    collection: "inquiries",
    id,
    data,
  });
  if (!res) throw new Error("Failed to update inquiry");
  return res;
}
