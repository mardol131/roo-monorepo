import { getCollection } from "@/app/functions/api/general";
import { Cuisine, PayloadResponse, Where } from "@roo/common";

export type FetchCuisinesOptions = {
  query?: Where;
  limit?: number;
  sortBy?: string;
};

export async function fetchCuisines(
  options?: FetchCuisinesOptions,
): Promise<PayloadResponse<Cuisine>> {
  const { query, limit = 100, sortBy = "name" } = options || {};
  const res = await getCollection({
    collection: "cuisines",
    query,
    limit,
    sort: sortBy,
  });

  if (!res) throw new Error("Failed to fetch cuisines");
  return res;
}
