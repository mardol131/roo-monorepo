import { MOCK_VARIANTS } from "@/app/_mock/mock";

export async function fetchVariantsByListing(listingId: string) {
  const res = MOCK_VARIANTS.filter((variant) => {
    if (typeof variant.listing === "string") {
      return variant.listing === listingId;
    }
    return variant.listing.id === listingId;
  });
  if (!res) throw new Error("Failed to fetch variants");
  return res;
}

export async function fetchVariant(id: string) {
  const res = MOCK_VARIANTS.find((variant) => variant.id === id);
  if (!res) throw new Error("Failed to fetch variant");
  return res;
}
