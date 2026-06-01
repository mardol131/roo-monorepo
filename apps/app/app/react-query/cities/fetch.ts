import { getCollection, getCollectionItem } from "@/app/functions/api/general";
import { PayloadResponse, City, Where } from "@roo/common";

export type FetchCitiesOptions = {
  query?: Where;
  limit?: number;
  sortBy?: string;
};

export async function fetchCities(
  options?: FetchCitiesOptions,
): Promise<PayloadResponse<City>> {
  const { query, limit = 10, sortBy = "name" } = options || {};
  const res = await getCollection({
    collection: "cities",
    query,
    limit,
    sort: sortBy,
  });
  if (!res) throw new Error("Failed to fetch cities");
  return res;
}

export async function fetchCity(id: string): Promise<City> {
  const res = await getCollectionItem({
    id,
    collection: "cities",
  });
  return res;
}
