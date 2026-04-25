import { fetchChatMessagesByInquiry } from "@/app/react-query/chat-messages/fetch";
import { fetchInquiry } from "@/app/react-query/inquiries/fetch";
import { useInquiry } from "@/app/react-query/inquiries/hooks";
import { chatMessageKeys, inquiryKeys } from "@/app/react-query/query-keys";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import React, { PropsWithChildren } from "react";

type Props = {
  params: Promise<{
    companyId: string;
    listingId: string;
    inquiryId: string;
  }>;
};

export default async function layout({
  params,
  children,
}: PropsWithChildren<Props>) {
  const { companyId, listingId, inquiryId } = await params;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: inquiryKeys.byId(inquiryId),
    queryFn: () => fetchInquiry(inquiryId),
  });

  await queryClient.prefetchQuery({
    queryKey: chatMessageKeys.byInquiry(inquiryId),
    queryFn: () => fetchChatMessagesByInquiry(inquiryId),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}
