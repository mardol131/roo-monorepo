import { getCollection } from "@/app/functions/api/general";
import { Amenity, PayloadResponse, Where } from "@roo/common";

export type FetchAmenitiesOptions = {
  query?: Where;
  limit?: number;
  sortBy?: string;
};

export async function fetchAmenities(
  options?: FetchAmenitiesOptions,
): Promise<PayloadResponse<Amenity>> {
  const { query, limit = 100, sortBy = "name" } = options || {};
  const res = await getCollection({
    collection: "amenities",
    query,
    limit,
    sort: sortBy,
  });

  if (!res) throw new Error("Failed to fetch amenities");
  return res;
}
