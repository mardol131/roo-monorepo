import { getCollection } from "@/app/functions/api/general";
import { Rule, PayloadResponse, Where } from "@roo/common";

export type FetchRulesOptions = {
  query?: Where;
  limit?: number;
  sortBy?: string;
};

export async function fetchRules(
  options?: FetchRulesOptions,
): Promise<PayloadResponse<Rule>> {
  const { query, limit = 100, sortBy = "name" } = options || {};
  const res = await getCollection({
    collection: "rules",
    query,
    limit,
    sort: sortBy,
  });

  if (!res) throw new Error("Failed to fetch rules");
  return res;
}
