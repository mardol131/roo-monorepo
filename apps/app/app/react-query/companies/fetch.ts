import { COMPANIES } from "@/app/_mock/mock";
import { Company, PayloadResponse } from "@roo/common";

const baseUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/companies`;

export async function fetchCompanies(): Promise<PayloadResponse<Company>> {
  const res = await fetch(`${baseUrl}`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch companies");
  const data = await res.json();
  return data;
}

export async function fetchCompany(id: string): Promise<Company> {
  const res = await fetch(`${baseUrl}/${id}`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch company");
  const data = await res.json();
  return data;
}

export async function updateCompany(id: string, data: Partial<Company>) {
  const res = await fetch(`/api/companies/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update company");
  return res.json();
}

export type CreateCompanyPayload = Omit<
  Company,
  "id" | "createdAt" | "updatedAt" | "owner"
>;

export async function createCompany(data: CreateCompanyPayload) {
  const res = await fetch(`${baseUrl}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to create company");
  return res.json();
}
