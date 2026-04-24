import { useQuery } from "@tanstack/react-query";
import { chatMessageKeys } from "../query-keys";
import { fetchMessagesByInquiry } from "./fetch";

export function useChatMessagesByInquiry(inquiryId: string) {
  return useQuery({
    queryKey: chatMessageKeys.byInquiry(inquiryId),
    queryFn: () => fetchMessagesByInquiry(inquiryId),
  });
}
