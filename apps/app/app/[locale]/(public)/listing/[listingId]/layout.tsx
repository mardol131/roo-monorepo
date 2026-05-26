import { fetchCompanies } from "@/app/react-query/companies/fetch";
import { listingKeys } from "@/app/react-query/query-keys";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { cookies } from "next/headers";
import { PropsWithChildren } from "react";

type Props = {
  params: Promise<{ listingId: string }>;
};

export default async function layout({
  children,
  params,
}: PropsWithChildren<Props>) {
  const { listingId } = await params;
  const cookieStore = await cookies();
  const cookieHeader = { Cookie: cookieStore.toString() };

  const queryClient = new QueryClient();
  queryClient.prefetchQuery({
    queryKey: listingKeys.byId(listingId),
    queryFn: () => fetchCompanies({ headers: cookieHeader }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}
