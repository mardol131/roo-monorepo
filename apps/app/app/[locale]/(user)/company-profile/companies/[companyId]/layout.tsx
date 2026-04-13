import { fetchCompany } from "@/app/react-query/companies/fetch";
import { companyKeys, listingKeys } from "@/app/react-query/query-keys";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import ContentWrapper from "./content-wrapper";
import CustomSidebar from "./custom-sidebar";
import { fetchListingsByCompany } from "@/app/react-query/listings/fetch";

type Props = {
  params: Promise<{ companyId: string }>;
};

export default async function layout({
  children,
  params,
}: PropsWithChildren<Props>) {
  const { companyId } = await params;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: companyKeys.byId(companyId),
    queryFn: () => fetchCompany(companyId),
  });

  await queryClient.prefetchQuery({
    queryKey: listingKeys.byCompany(companyId),
    queryFn: () => fetchListingsByCompany(companyId),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CustomSidebar companyId={companyId} />
      <ContentWrapper>{children}</ContentWrapper>
    </HydrationBoundary>
  );
}
