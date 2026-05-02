import { getCollection } from "@/app/functions/api/general";
import { Activity, PayloadResponse, wait, Where } from "@roo/common";
import { stringify } from "qs-esm";

const baseUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/activities`;

export type FetchActivitiesOptions = {
  query?: Where;
  limit?: number;
  sortBy?: string;
};

export async function fetchActivities(
  options?: FetchActivitiesOptions,
): Promise<PayloadResponse<Activity>> {
  const { query, limit = 10, sortBy = "name" } = options || {};
  const res = await getCollection({
    collection: "activities",
    query,
    limit,
    sort: sortBy,
  });

  if (!res) throw new Error("Failed to fetch activities");
  return res;
}
