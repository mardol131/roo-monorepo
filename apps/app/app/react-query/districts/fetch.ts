import { getCollection, GetCollectionParams } from "@/app/functions/api/general";
import { PayloadResponse, District } from "@roo/common";

export async function fetchDistricts(
  options?: GetCollectionParams,
): Promise<PayloadResponse<District>> {
  const res = await getCollection({ collection: "districts", ...options });
  if (!res) throw new Error("Failed to fetch districts");
  return res;
}
