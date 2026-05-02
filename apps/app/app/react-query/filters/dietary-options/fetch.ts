import { getCollection } from "@/app/functions/api/general";
import { DietaryOption, PayloadResponse, Where } from "@roo/common";

export type FetchDietaryOptionsOptions = {
  query?: Where;
  limit?: number;
  sortBy?: string;
};

export async function fetchDietaryOptions(
  options?: FetchDietaryOptionsOptions,
): Promise<PayloadResponse<DietaryOption>> {
  const { query, limit = 100, sortBy = "name" } = options || {};
  const res = await getCollection({
    collection: "dietary-options",
    query,
    limit,
    sort: sortBy,
  });

  if (!res) throw new Error("Failed to fetch dietary-options");
  return res;
}
