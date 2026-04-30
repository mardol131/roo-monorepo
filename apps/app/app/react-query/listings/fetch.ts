import { LISTINGS } from "@/app/_mock/mock";
import { Listing, PayloadResponse, wait } from "@roo/common";

const baseUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL ?? ""}/api/listings`;

export async function fetchAllListings() {
  return LISTINGS;
}

export async function fetchListingsByCompany(
  companyId: string,
): Promise<PayloadResponse<Listing>> {
  const res = await fetch(`${baseUrl}?companyId=${companyId}`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch listings");
  return res.json();
}

export async function fetchListing(id: string): Promise<Listing> {
  const res = await fetch(`${baseUrl}/${id}`, { credentials: "include" });
  console.log("fetching listing with id:", id);
  if (!res.ok) throw new Error("Failed to fetch listing");
  const data = await res.json();
  console.log("fetched listing data:", data);
  return data;
}

export async function updateListing(id: string, data: Partial<Listing>) {
  const res = await fetch(`${baseUrl}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to update listing");
  return res.json();
}

export type CreateListingPayload = Omit<
  Listing,
  "id" | "createdAt" | "updatedAt" | "status" | "slug"
>;

export async function createListing(data: CreateListingPayload) {
  const res = await fetch(`${baseUrl}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to create listing");
  return res.json();
}

export async function deleteListing(id: string) {
  const res = await fetch(`${baseUrl}/${id}`, { method: "DELETE" });

  if (!res.ok) throw new Error("Failed to delete listing");
}
