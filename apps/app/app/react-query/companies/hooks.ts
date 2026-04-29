import { Company } from "@roo/common";
import {
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { companyKeys } from "../query-keys";
import {
  createCompany,
  CreateCompanyPayload,
  fetchCompanies,
  fetchCompany,
  updateCompany,
} from "./fetch";

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

export function useUpdateCompany(
  id: string,
  options?: UseMutationOptions<Company, Error, CreateCompanyPayload>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCompanyPayload) => updateCompany(id, data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: companyKeys.byId(id) });
      queryClient.invalidateQueries({ queryKey: companyKeys.all() });
      options?.onSuccess?.(...args);
    },
    onError: options?.onError,
  });
}

export function useCreateCompany(
  options?: UseMutationOptions<Company, Error, CreateCompanyPayload>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCompanyPayload) => createCompany(data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: companyKeys.all() });
      options?.onSuccess?.(...args);
    },
    onError: options?.onError,
  });
}
