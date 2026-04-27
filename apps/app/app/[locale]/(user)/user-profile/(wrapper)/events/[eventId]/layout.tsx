import { fetchEventById } from "@/app/react-query/events/fetch";
import { eventKeys } from "@/app/react-query/query-keys";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import React from "react";

type Props = {
  children: React.ReactNode;
  params: Promise<{ eventId: string }>;
};

export default async function layout({ children, params }: Props) {
  const queryClient = new QueryClient();

  const { eventId } = await params;

  queryClient.prefetchQuery({
    queryKey: eventKeys.byId(eventId),
    queryFn: () => fetchEventById(eventId),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}
