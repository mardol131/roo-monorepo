import {
  getCollection,
  getCollectionItem,
  patchCollectionItem,
  postCollectionItem,
} from "@/app/functions/api/general";
import { Company, PayloadResponse } from "@roo/common";

export async function fetchCompanies(): Promise<PayloadResponse<Company>> {
  const res = await getCollection({
    collection: "companies",
    sort: "-createdAt",
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

export async function updateCompany(id: string, data: CreateCompanyPayload) {
  const res = await patchCollectionItem({
    collection: "companies",
    id,
    data,
  });
  if (!res) throw new Error("Failed to update company");
  return res;
}

export type CreateCompanyPayload = Omit<
  Company,
  "id" | "createdAt" | "updatedAt" | "owner"
>;

export async function createCompany(data: CreateCompanyPayload) {
  const res = await postCollectionItem({
    collection: "companies",
    data,
  });
  if (!res) throw new Error("Failed to create company");
  return res;
}
