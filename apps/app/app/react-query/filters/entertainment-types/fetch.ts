import { getCollection } from "@/app/functions/api/general";
import { EntertainmentType, PayloadResponse, Where } from "@roo/common";

export type FetchEntertainmentTypesOptions = {
  query?: Where;
  limit?: number;
  sortBy?: string;
};

export async function fetchEntertainmentTypes(
  options?: FetchEntertainmentTypesOptions,
): Promise<PayloadResponse<EntertainmentType>> {
  const { query, limit = 100, sortBy = "name" } = options || {};
  const res = await getCollection({
    collection: "entertainment-types",
    query,
    limit,
    sort: sortBy,
  });

  if (!res) throw new Error("Failed to fetch entertainment-types");
  return res;
}
