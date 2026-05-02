import { getCollection } from "@/app/functions/api/general";
import { EventType, PayloadResponse, Where } from "@roo/common";

export type FetchEventTypesOptions = {
  query?: Where;
  limit?: number;
  sortBy?: string;
};

export async function fetchEventTypes(
  options?: FetchEventTypesOptions,
): Promise<PayloadResponse<EventType>> {
  const { query, limit = 100, sortBy = "name" } = options || {};
  const res = await getCollection({
    collection: "event-types",
    query,
    limit,
    sort: sortBy,
  });

  if (!res) throw new Error("Failed to fetch event-types");
  return res;
}
