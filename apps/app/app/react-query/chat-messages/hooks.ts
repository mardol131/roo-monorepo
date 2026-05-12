import {
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { chatMessageKeys } from "../query-keys";
import {
  createChatMessage,
  CreateChatMessagePayload,
  fetchChatMessagesByInquiry,
} from "./fetch";
import { ChatMessage, getIdFromRelationshipField } from "@roo/common";

export function useChatMessagesByInquiry(
  inquiryId: string,
  options?: { refetchInterval?: number },
) {
  return useQuery({
    queryKey: chatMessageKeys.byInquiry(inquiryId),
    queryFn: () => fetchChatMessagesByInquiry(inquiryId),
    ...options,
  });
}

export function useCreateChatMessage(
  options?: UseMutationOptions<
    { doc: ChatMessage; message: string },
    Error,
    CreateChatMessagePayload
  >,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateChatMessagePayload) =>
      createChatMessage(payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: chatMessageKeys.byInquiry(
          getIdFromRelationshipField(variables.inquiry),
        ),
      });
    },
    ...options,
  });
}
