import { getCollection } from "@/app/functions/api/general";
import { FoodServiceStyle, PayloadResponse, Where } from "@roo/common";

export type FetchFoodServiceStylesOptions = {
  query?: Where;
  limit?: number;
  sortBy?: string;
};

export async function fetchFoodServiceStyles(
  options?: FetchFoodServiceStylesOptions,
): Promise<PayloadResponse<FoodServiceStyle>> {
  const { query, limit = 100, sortBy = "name" } = options || {};
  const res = await getCollection({
    collection: "food-service-styles",
    query,
    limit,
    sort: sortBy,
  });

  if (!res) throw new Error("Failed to fetch food-service-styles");
  return res;
}
