import { PayloadResponse, City, Where } from "@roo/common";
import { stringify } from "qs-esm";

const baseUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cities`;

export type FetchCitiesOptions = {
  query?: Where;
  limit?: number;
  sortBy?: string;
};

export async function fetchCities(
  options?: FetchCitiesOptions,
): Promise<PayloadResponse<City>> {
  const { query, limit = 10, sortBy = "name" } = options || {};
  const res = await fetch(
    `${baseUrl}?${sortBy ? `sort=${sortBy}&` : ""}${stringify({ where: query, limit }, { encodeValuesOnly: true })}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_BACKEND_TOKEN}`,
      },
    },
  ).then((res) => res.json());

  if (!res) throw new Error("Failed to fetch cities");
  return res;
}
