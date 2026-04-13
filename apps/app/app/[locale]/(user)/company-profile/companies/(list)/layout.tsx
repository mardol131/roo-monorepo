import { fetchCompanies } from "@/app/react-query/companies/fetch";
import { companyKeys } from "@/app/react-query/query-keys";
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
    queryKey: companyKeys.all(),
    queryFn: () => fetchCompanies(),
  });

  return (
    <>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <div className="flex-1 flex justify-center">
          <div className="max-w-user-profile-content w-full flex flex-col px-8 py-20">
            {children}
          </div>
        </div>
      </HydrationBoundary>
    </>
  );
}
