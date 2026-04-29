"use client";

import { IntlPathname, usePathname } from "@/app/i18n/navigation";
import {
  Building2,
  Calendar,
  LandPlot,
  Layers,
  LayoutDashboard,
  LogOut,
  MessageCircle,
  MessageSquare,
  Plus,
  Settings,
  Tag,
} from "lucide-react";
import React, { useCallback, useMemo } from "react";
import Sidebar, { SidebarProps } from "../components/sidebar";
import { useCompany } from "@/app/react-query/companies/hooks";
import { useParams } from "next/dist/client/components/navigation";
import { SubSidebar, SubSidebarProps } from "../components/sub-sidebar";
import { useListing } from "@/app/react-query/listings/hooks";
import { SidebarItem } from "../components/sidebar-item";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { companyKeys, listingKeys } from "@/app/react-query/query-keys";
import { fetchCompanies } from "@/app/react-query/companies/fetch";
import { fetchAllListings } from "@/app/react-query/listings/fetch";
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
