import {
  getCollection,
  getCollectionItem,
  GetCollectionParams,
  patchCollectionItem,
  postCollectionItem,
} from "@/app/functions/api/general";
import { Inquiry, Listing, Where } from "@roo/common";
import { PatchData } from "@/app/functions/api/general";

export async function fetchInquiriesByListing(listingId: string) {
  const res = await getCollection({
    collection: "inquiries",
    query: { listing: { equals: listingId } },
    searchParams: new URLSearchParams({
      depth: "2",
    }),
  });
  if (!res) throw new Error("Failed to fetch inquiries");
  return res;
}

export type AcceptedInquiryPublicData = {
  listing: { id: string; name: string; type?: Listing["type"] };
};

export async function fetchAcceptedInquiriesOnEvent(
  eventId: string,
  inquiryId: string,
): Promise<{
  docs: AcceptedInquiryPublicData[];
  totalDocs: number;
}> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/inquiries/get-accepted-inquiries-on-event`,
    {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventId, inquiryId }),
    },
  );
  if (!res.ok) throw new Error("Failed to fetch accepted inquiries");
  return res.json();
}

export async function fetchInquiries(options?: GetCollectionParams) {
  const { query, limit, sort } = options ?? {};
  const res = await getCollection({
    collection: "inquiries",
    query,
    limit,
    sort,
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
