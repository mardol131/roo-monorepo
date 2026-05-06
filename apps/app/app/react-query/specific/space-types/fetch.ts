import { getCollection } from "@/app/functions/api/general";
import { Rule, PayloadResponse, Where, SpaceType } from "@roo/common";

export type FetchSpaceTypesOptions = {
  query?: Where;
  limit?: number;
  sortBy?: string;
};

export async function fetchSpaceTypes(
  options?: FetchSpaceTypesOptions,
): Promise<PayloadResponse<SpaceType>> {
  const { query, limit = 100, sortBy = "name" } = options || {};
  const res = await getCollection({
    collection: "space-types",
    query,
    limit,
    sort: sortBy,
  });

  if (!res) throw new Error("Failed to fetch space types");
  return res;
}
