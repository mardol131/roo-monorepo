import { MOCK_SPACES } from "@/app/_mock/mock";

export async function fetchSpacesByListing(listingId: string) {
  const res = MOCK_SPACES.filter((space) => {
    if (typeof space.listing === "string") {
      return space.listing === listingId;
    }
    return space.listing.id === listingId;
  });
  if (!res) throw new Error("Failed to fetch spaces");
  return res;
}

export async function fetchSpace(id: string) {
  const res = MOCK_SPACES.find((space) => space.id === id);
  if (!res) throw new Error("Failed to fetch space");
  return res;
}
