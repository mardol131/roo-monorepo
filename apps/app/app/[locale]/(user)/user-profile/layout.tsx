import React from "react";
import Sidebar, { SidebarProps } from "../components/sidebar";
import ContentWrapper from "./content-wrapper";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { eventKeys, inquiryKeys } from "@/app/react-query/query-keys";
import { fetchEvents } from "@/app/react-query/events/fetch";
import { fetchInquiries } from "@/app/react-query/inquiries/fetch";
import Navbar from "../components/navbar";

type Props = {
  children: React.ReactNode;
};

export default function layout({ children }: Props) {
  const queryClient = new QueryClient();

  queryClient.prefetchQuery({
    queryKey: eventKeys.all(),
    queryFn: () => fetchEvents(),
  });

  queryClient.prefetchQuery({
    queryKey: inquiryKeys.all(),
    queryFn: () => fetchInquiries(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ContentWrapper>{children}</ContentWrapper>
    </HydrationBoundary>
  );
}
