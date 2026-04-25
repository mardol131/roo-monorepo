import { fetchEvents } from "@/app/react-query/events/fetch";
import { fetchInquiries } from "@/app/react-query/inquiries/fetch";
import { eventKeys, inquiryKeys } from "@/app/react-query/query-keys";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import React from "react";

type Props = {
  children: React.ReactNode;
};

export default async function layout({ children }: Props) {
  const queryClient = new QueryClient();

  queryClient.prefetchQuery({
    queryKey: eventKeys.all(),
    queryFn: () => fetchEvents(),
  });

  queryClient.prefetchQuery({
    queryKey: inquiryKeys.all(),
    queryFn: () => fetchInquiries(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}
