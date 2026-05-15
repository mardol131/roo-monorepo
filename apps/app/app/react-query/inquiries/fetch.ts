import {
  getCollection,
  getCollectionItem,
  patchCollectionItem,
  postCollectionItem,
} from "@/app/functions/api/general";
import { Inquiry, Listing, Where } from "@roo/common";
import { PatchData } from "@/app/functions/api/general";

export async function fetchInquiriesByListing(listingId: string) {
  const res = await getCollection({
    collection: "inquiries",
    query: { listing: { equals: listingId } },
  });
  if (!res) throw new Error("Failed to fetch inquiries");
  return res;
}

export type FetchInquiriesOptions = {
  query?: Where;
  limit?: number;
  sortBy?: string;
};

export async function fetchInquiries({
  query,
  limit,
  sortBy,
}: FetchInquiriesOptions = {}) {
  const res = await getCollection({
    collection: "inquiries",
    query,
    limit,
    sort: sortBy,
  });
  if (!res) throw new Error("Failed to fetch inquiries");
  return res;
}

export async function fetchInquiry(id: string) {
  const res = await getCollectionItem({
    collection: "inquiries",
    id,
  });
  if (!res) throw new Error("Failed to fetch inquiry");
  return res;
}

export async function updateInquiry(id: string, data: PatchData<Inquiry>) {
  const res = await patchCollectionItem({
    collection: "inquiries",
    id,
    data,
  });
  if (!res) throw new Error("Failed to update inquiry");
  return res;
}

type CreateInquiryData = Omit<Inquiry, "id" | "createdAt" | "updatedAt">;

export async function createInquiry(data: CreateInquiryData) {
  const res = await postCollectionItem({
    collection: "inquiries",
    data,
  });
  if (!res) throw new Error("Failed to create inquiry");
  return res;
}
