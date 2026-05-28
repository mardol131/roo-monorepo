import { Company } from "@roo/common";
import {
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { GetCollectionParams } from "@/app/functions/api/general";
import { companyKeys } from "../query-keys";
import {
  createCompany,
  CreateCompanyPayload,
  fetchCompanies,
  fetchCompany,
  updateCompany,
  UpdateCompanyPayload,
} from "./fetch";

export function useCompanies({
  options,
  enabled,
}: { options?: GetCollectionParams; enabled?: boolean } = {}) {
  return useQuery({
    queryKey: companyKeys.all(options?.query, options?.limit),
    queryFn: () => fetchCompanies(options),
    enabled,
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
  options?: UseMutationOptions<
    Company,
    Error,
    { id: string; data: UpdateCompanyPayload }
  >,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCompanyPayload }) =>
      updateCompany(id, data),
    onSuccess: (company, variables, ...rest) => {
      queryClient.invalidateQueries({
        queryKey: companyKeys.byId(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: companyKeys.all() });
      options?.onSuccess?.(company, variables, ...rest);
    },
    onError: options?.onError,
  });
}

export function useCreateCompany(
  options?: UseMutationOptions<
    { doc: Company; message: string },
    Error,
    CreateCompanyPayload
  >,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCompanyPayload) => createCompany(data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: companyKeys.root() });
      options?.onSuccess?.(...args);
    },
    onError: options?.onError,
  });
}
