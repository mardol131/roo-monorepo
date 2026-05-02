import { getCollection } from "@/app/functions/api/general";
import { Necessity, PayloadResponse, Where } from "@roo/common";

export type FetchNecessitiesOptions = {
  query?: Where;
  limit?: number;
  sortBy?: string;
};

export async function fetchNecessities(
  options?: FetchNecessitiesOptions,
): Promise<PayloadResponse<Necessity>> {
  const { query, limit = 100, sortBy = "name" } = options || {};
  const res = await getCollection({
    collection: "necessities",
    query,
    limit,
    sort: sortBy,
  });

  if (!res) throw new Error("Failed to fetch necessities");
  return res;
}
