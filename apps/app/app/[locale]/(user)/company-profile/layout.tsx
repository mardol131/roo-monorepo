"use client";

import { fetchCompanies } from "@/app/react-query/companies/fetch";
import { fetchAllListings } from "@/app/react-query/listings/fetch";
import { companyKeys, listingKeys } from "@/app/react-query/query-keys";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import React from "react";
import ContentWrapper from "./content-wrapper";

type Props = {
  children: React.ReactNode;
};

export default function layout({ children }: Props) {
  const queryClient = new QueryClient();

  queryClient.prefetchQuery({
    queryKey: companyKeys.all(),
    queryFn: () => fetchCompanies(),
  });

  queryClient.prefetchQuery({
    queryKey: listingKeys.all(),
    queryFn: () => fetchAllListings(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ContentWrapper> {children}</ContentWrapper>
    </HydrationBoundary>
  );
}
