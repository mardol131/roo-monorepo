import { Company, Invitation } from "@roo/common";
import {
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { invitationKeys } from "../query-keys";
import {
  fetchPendingInvitationsByCompany,
  updateInvitation,
  UpdateInvitationPayload,
} from "./fetch";

export function usePendingInvitationsByCompany(companyId: string) {
  return useQuery({
    queryKey: invitationKeys.byCompany(companyId),
    queryFn: () => fetchPendingInvitationsByCompany(companyId),
  });
}

export function useUpdateInvitation(
  options?: UseMutationOptions<
    Invitation,
    Error,
    { id: string; data: UpdateInvitationPayload }
  >,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateInvitationPayload }) =>
      updateInvitation(id, data),
    onSuccess: (invitation, variables, ...rest) => {
      queryClient.invalidateQueries({
        queryKey: invitationKeys.byCompany(),
      });

      options?.onSuccess?.(invitation, variables, ...rest);
    },
    onError: options?.onError,
  });
}
