import { fetchInquiriesByListing } from "@/app/react-query/inquiries/fetch";
import { fetchListing } from "@/app/react-query/listings/fetch";
import {
  inquiryKeys,
  listingKeys,
  spaceKeys,
  variantKeys,
} from "@/app/react-query/query-keys";
import { fetchSpacesByListing } from "@/app/react-query/spaces/fetch";
import { fetchVariantsByListing } from "@/app/react-query/variants/fetch";
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
  }>;
};

export default async function layout({
  params,
  children,
}: PropsWithChildren<Props>) {
  const { listingId } = await params;
  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: listingKeys.byId(listingId),
      queryFn: () => fetchListing(listingId),
    }),
    queryClient.prefetchQuery({
      queryKey: inquiryKeys.byListing(listingId),
      queryFn: () => fetchInquiriesByListing(listingId),
    }),
    queryClient.prefetchQuery({
      queryKey: variantKeys.byListing(listingId),
      queryFn: () => fetchVariantsByListing(listingId),
    }),
    queryClient.prefetchQuery({
      queryKey: spaceKeys.byListing(listingId),
      queryFn: () => fetchSpacesByListing(listingId),
    }),
  ]);
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}
