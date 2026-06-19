import { getCollection, GetCollectionParams } from "@/app/functions/api/general";
import { PayloadResponse, Region } from "@roo/common";

export async function fetchRegions(
  options?: GetCollectionParams,
): Promise<PayloadResponse<Region>> {
  const res = await getCollection({ collection: "regions", ...options });
  if (!res) throw new Error("Failed to fetch regions");
  return res;
}
