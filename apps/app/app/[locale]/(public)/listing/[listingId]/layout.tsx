import { fetchCompanies } from "@/app/react-query/companies/fetch";
import { listingKeys } from "@/app/react-query/query-keys";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { PropsWithChildren } from "react";

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
    queryKey: listingKeys.byId(listingId),
    queryFn: () => fetchCompanies(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}
