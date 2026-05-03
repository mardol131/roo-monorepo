import { getCollection } from "@/app/functions/api/general";
import { PayloadResponse, City, Where } from "@roo/common";
import { stringify } from "qs-esm";

const baseUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cities`;

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
