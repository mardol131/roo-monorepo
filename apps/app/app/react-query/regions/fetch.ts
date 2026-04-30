import { PayloadResponse, Region, Where } from "@roo/common";
import { stringify } from "qs-esm";

const baseUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/regions`;

export async function fetchRegions(query?: Where, limit = 10): Promise<PayloadResponse<Region>> {
  const res = await fetch(
    `${baseUrl}?${stringify({ where: query, limit }, { encodeValuesOnly: true })}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_BACKEND_TOKEN}`,
      },
    },
  ).then((res) => res.json());

  if (!res) throw new Error("Failed to fetch regions");
  return res;
}
