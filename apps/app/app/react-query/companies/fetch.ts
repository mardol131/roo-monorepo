import { COMPANIES } from "@/app/_mock/mock";
import { Company } from "@roo/common";

export async function fetchCompanies() {
  const res = COMPANIES;
  if (!res) throw new Error("Failed to fetch companies");
  return res;
}

export async function fetchCompany(id: string) {
  const res = COMPANIES.find((company) => company.id === id);
  if (!res) throw new Error("Failed to fetch company");
  return res;
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
