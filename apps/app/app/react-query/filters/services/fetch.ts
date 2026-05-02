import { getCollection } from "@/app/functions/api/general";
import { Service, PayloadResponse, Where } from "@roo/common";

export type FetchServicesOptions = {
  query?: Where;
  limit?: number;
  sortBy?: string;
};

export async function fetchServices(
  options?: FetchServicesOptions,
): Promise<PayloadResponse<Service>> {
  const { query, limit = 100, sortBy = "name" } = options || {};
  const res = await getCollection({
    collection: "services",
    query,
    limit,
    sort: sortBy,
  });

  if (!res) throw new Error("Failed to fetch services");
  return res;
}
