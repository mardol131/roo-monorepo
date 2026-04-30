import { MOCK_VARIANTS } from "@/app/_mock/mock";
import { PayloadResponse, Variant } from "@roo/common";

const baseUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/variants`;

export async function fetchVariantsByListing(
  listingId: string,
): Promise<PayloadResponse<Variant>> {
  const res = await fetch(`${baseUrl}?listingId=${listingId}`).then((res) =>
    res.json(),
  );
  if (!res) throw new Error("Failed to fetch variants");
  return res;
}

export async function fetchVariant(id: string) {
  const res = MOCK_VARIANTS.find((variant) => variant.id === id);
  if (!res) throw new Error("Failed to fetch variant");
  return res;
}
