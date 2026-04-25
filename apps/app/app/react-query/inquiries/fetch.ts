import { getInquiries, LISTINGS } from "@/app/_mock/mock";
import { Listing } from "@roo/common";

export async function fetchInquiriesByListing(listingId: string) {
  const res = getInquiries().filter((inquiry) => {
    if (typeof inquiry.listing.value === "string") {
      return inquiry.listing.value === listingId;
    }
    return inquiry.listing.value.id === listingId;
  });
  if (!res) throw new Error("Failed to fetch inquiries");
  return res;
}

export async function fetchInquiries() {
  const res = getInquiries();
  if (!res) throw new Error("Failed to fetch inquiries");
  return res;
}

export async function fetchInquiry(id: string) {
  const res = getInquiries().find((inquiry) => inquiry.id === id);
  if (!res) throw new Error("Failed to fetch inquiry");
  return res;
}

export async function updateInquiry(id: string, data: Partial<Listing>) {
  const res = await fetch(`/api/inquiries/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update inquiry");
  return res.json();
}
