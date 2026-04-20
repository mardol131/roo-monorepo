import { LISTINGS } from "@/app/_mock/mock";
import { Listing } from "@roo/common";

export async function fetchListingsByCompany(companyId: string) {
  const res = LISTINGS.filter((listing) => {
    if (typeof listing.company === "string") return listing.company === companyId;
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
  const res = await fetch(`/api/listings/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update listing");
  return res.json();
}
