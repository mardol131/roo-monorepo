import { getCollection, getCollectionItem, GetCollectionParams } from "@/app/functions/api/general";
import { PayloadResponse, City } from "@roo/common";

export async function fetchCities(
  options?: GetCollectionParams,
): Promise<PayloadResponse<City>> {
  const res = await getCollection({ sort: "name", ...options, collection: "cities" });
  if (!res) throw new Error("Failed to fetch cities");
  return res;
}

export async function fetchCity(id: string): Promise<City> {
  return getCollectionItem({ collection: "cities", id });
}
