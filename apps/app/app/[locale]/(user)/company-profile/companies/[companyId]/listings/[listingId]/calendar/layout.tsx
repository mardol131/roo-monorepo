import { fetchCalendarEventsByListing } from "@/app/react-query/calendar-events/fetch";
import { calendarEventKeys } from "@/app/react-query/query-keys";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import React, { PropsWithChildren } from "react";

type Props = {
  params: Promise<{ listingId: string }>;
};

export default async function layout({
  children,
  params,
}: PropsWithChildren<Props>) {
  const { listingId } = await params;

  const queryClient = new QueryClient();

  queryClient.prefetchQuery({
    queryKey: calendarEventKeys.byListing(listingId),
    queryFn: () => fetchCalendarEventsByListing(listingId),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}
