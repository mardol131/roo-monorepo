import {
  getCollection,
  getCollectionItem,
  GetCollectionParams,
  patchCollectionItem,
  postCollectionItem,
} from "@/app/functions/api/general";
import { Company, PayloadResponse } from "@roo/common";

export async function fetchCompanies(
  options?: GetCollectionParams,
): Promise<PayloadResponse<Company>> {
  const { query, limit, sort = "-createdAt" } = options ?? {};
  const res = await getCollection({
    collection: "companies",
    query,
    limit,
    sort,
  });
  if (!res) throw new Error("Failed to fetch companies");
  return res;
}

export async function fetchCompany(id: string): Promise<Company> {
  const res = await getCollectionItem({
    collection: "companies",
    id,
  });
  if (!res) throw new Error("Failed to fetch company");
  return res;
}

export type UpdateCompanyPayload = Omit<Partial<Company>, "logo"> & {
  logo?: Company["logo"] | null;
};

export async function updateCompany(
  id: string,
  data: UpdateCompanyPayload,
): Promise<Company> {
  const res = await patchCollectionItem({
    collection: "companies",
    id,
    data,
  });
  if (!res) throw new Error("Failed to update company");
  return res;
}

export type CreateCompanyPayload = Omit<
  Company & { logo?: Company["logo"] | null },
  "id" | "createdAt" | "updatedAt" | "owner" | "status" | "slug"
>;

export async function createCompany(data: CreateCompanyPayload) {
  const res = await postCollectionItem({
    collection: "companies",
    data,
  });
  if (!res) throw new Error("Failed to create company");
  return res;
}
