import { PayloadResponse, City, Where } from "@roo/common";
import { stringify } from "qs-esm";

const baseUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cities`;

export async function fetchCities(query?: Where, limit = 10): Promise<PayloadResponse<City>> {
  const res = await fetch(
    `${baseUrl}?${stringify({ where: query, limit }, { encodeValuesOnly: true })}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_BACKEND_TOKEN}`,
      },
    },
  ).then((res) => res.json());

  if (!res) throw new Error("Failed to fetch cities");
  return res;
}
