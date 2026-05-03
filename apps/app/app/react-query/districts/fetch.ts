import { getCollection } from "@/app/functions/api/general";
import { PayloadResponse, District, Where } from "@roo/common";
import { stringify } from "qs-esm";

const baseUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/districts`;

export async function fetchDistricts(
  query?: Where,
  limit = 10,
): Promise<PayloadResponse<District>> {
  const res = await getCollection({
    collection: "districts",
    query,
    limit,
  });

  if (!res) throw new Error("Failed to fetch districts");
  return res;
}
