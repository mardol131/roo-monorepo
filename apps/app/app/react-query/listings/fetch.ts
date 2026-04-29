import { LISTINGS } from "@/app/_mock/mock";
import { Listing, wait } from "@roo/common";

const baseUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL ?? ""}/api/listings`;

export async function fetchAllListings() {
  return LISTINGS;
}

export async function fetchListingsByCompany(companyId: string) {
  const res = LISTINGS.filter((listing) => {
    if (typeof listing.company === "string")
      return listing.company === companyId;
    return listing.company.id === companyId;
  });
  if (!res) throw new Error("Failed to fetch listings");
  return res;
}

export async function fetchListing(id: string) {
  const res = LISTINGS.find((listing) => listing.id === id);
  if (!res) throw new Error("Failed to fetch listing");
  return res;
}

export async function updateListing(id: string, data: Partial<Listing>) {
  const res = await fetch(`${baseUrl}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
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
