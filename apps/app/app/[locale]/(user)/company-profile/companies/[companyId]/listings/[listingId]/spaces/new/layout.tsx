import { spaceKeys } from "@/app/react-query/query-keys";
import { fetchSpace } from "@/app/react-query/spaces/fetch";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import React, { PropsWithChildren } from "react";

type Props = {
  searchParams: Promise<{
    parentId?: string;
  }>;
};

export default async function layout({
  searchParams,
  children,
}: PropsWithChildren<Props>) {
  const query = await searchParams;
  const parentId = query?.parentId;

  const queryClient = new QueryClient();

  if (parentId && typeof parentId === "string") {
    queryClient.prefetchQuery({
      queryKey: spaceKeys.byId(parentId),
      queryFn: () => fetchSpace(parentId),
    });
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}
