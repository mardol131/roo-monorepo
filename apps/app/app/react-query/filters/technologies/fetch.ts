import { getCollection } from "@/app/functions/api/general";
import { Technology, PayloadResponse, Where } from "@roo/common";

export type FetchTechnologiesOptions = {
  query?: Where;
  limit?: number;
  sortBy?: string;
};

export async function fetchTechnologies(
  options?: FetchTechnologiesOptions,
): Promise<PayloadResponse<Technology>> {
  const { query, limit = 100, sortBy = "name" } = options || {};
  const res = await getCollection({
    collection: "technologies",
    query,
    limit,
    sort: sortBy,
  });

  if (!res) throw new Error("Failed to fetch technologies");
  return res;
}
