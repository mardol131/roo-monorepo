import { getCollection } from "@/app/functions/api/general";
import { DishType, PayloadResponse, Where } from "@roo/common";

export type FetchDishTypesOptions = {
  query?: Where;
  limit?: number;
  sortBy?: string;
};

export async function fetchDishTypes(
  options?: FetchDishTypesOptions,
): Promise<PayloadResponse<DishType>> {
  const { query, limit = 100, sortBy = "name" } = options || {};
  const res = await getCollection({
    collection: "dish-types",
    query,
    limit,
    sort: sortBy,
  });

  if (!res) throw new Error("Failed to fetch dish-types");
  return res;
}
