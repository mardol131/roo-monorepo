import { getCollection } from "@/app/functions/api/general";
import { PlaceType, PayloadResponse, Where } from "@roo/common";

export type FetchPlaceTypesOptions = {
  query?: Where;
  limit?: number;
  sortBy?: string;
};

export async function fetchPlaceTypes(
  options?: FetchPlaceTypesOptions,
): Promise<PayloadResponse<PlaceType>> {
  const { query, limit = 100, sortBy = "name" } = options || {};
  const res = await getCollection({
    collection: "place-types",
    query,
    limit,
    sort: sortBy,
  });

  if (!res) throw new Error("Failed to fetch place-types");
  return res;
}
