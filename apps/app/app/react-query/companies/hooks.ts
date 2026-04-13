import { Company } from "@roo/common";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { companyKeys } from "../query-keys";
import { fetchCompanies, fetchCompany, updateCompany } from "./fetch";

export function useCompanies() {
  return useQuery({
    queryKey: companyKeys.all(),
    queryFn: () => fetchCompanies(),
  });
}

export function useCompany(id: string | undefined) {
  return useQuery({
    queryKey: companyKeys.byId(id ?? ""),
    queryFn: () => fetchCompany(id!),
    enabled: !!id,
  });
}

export function useUpdateCompany(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Company>) => updateCompany(id, data),
    onSuccess: () => {
      // Invaliduje detail listingu i seznam na dashboardu
      queryClient.invalidateQueries({ queryKey: companyKeys.byId(id) });
      queryClient.invalidateQueries({ queryKey: companyKeys.all() });
    },
  });
}
