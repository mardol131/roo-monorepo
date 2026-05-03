import { getCollection } from "@/app/functions/api/general";
import { PayloadResponse, Region, Where } from "@roo/common";
import { stringify } from "qs-esm";

const baseUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/regions`;

export async function fetchRegions(
  query?: Where,
  limit = 10,
): Promise<PayloadResponse<Region>> {
  const res = await getCollection({
    collection: "regions",
    query,
    limit,
  });

  if (!res) throw new Error("Failed to fetch regions");
  return res;
}
