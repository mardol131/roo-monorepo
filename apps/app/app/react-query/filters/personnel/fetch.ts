import { getCollection } from "@/app/functions/api/general";
import { Personnel, PayloadResponse, Where } from "@roo/common";

export type FetchPersonnelOptions = {
  query?: Where;
  limit?: number;
  sortBy?: string;
};

export async function fetchPersonnel(
  options?: FetchPersonnelOptions,
): Promise<PayloadResponse<Personnel>> {
  const { query, limit = 100, sortBy = "name" } = options || {};
  const res = await getCollection({
    collection: "personnel",
    query,
    limit,
    sort: sortBy,
  });

  if (!res) throw new Error("Failed to fetch personnel");
  return res;
}
