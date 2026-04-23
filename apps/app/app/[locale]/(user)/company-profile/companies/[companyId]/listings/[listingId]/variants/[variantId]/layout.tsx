import { variantKeys } from "@/app/react-query/query-keys";
import { fetchVariant } from "@/app/react-query/variants/fetch";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import React, { PropsWithChildren } from "react";

type Props = {
  params: Promise<{ companyId: string; listingId: string; variantId: string }>;
};

export default async function layout({
  params,
  children,
}: PropsWithChildren<Props>) {
  const { variantId } = await params;

  const queryClient = new QueryClient();

  queryClient.prefetchQuery({
    queryKey: variantKeys.byId(variantId),
    queryFn: () => fetchVariant(variantId),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}
