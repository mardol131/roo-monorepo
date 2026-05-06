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

type Props = {
  children: React.ReactNode;
};

export default function layout({ children }: Props) {
  const queryClient = new QueryClient();

  const sidebar: SidebarProps = {
    mainMenuItems: [
      { label: "Přehled", href: "/user-profile", icon: "LayoutDashboard" },
      {
        label: "Nová událost",
        href: "/user-profile/events/new",
        icon: "Plus",
      },
      {
        label: "Události",
        href: "/user-profile/events",
        icon: "Calendar",
      },
      {
        label: "Poptávky",
        href: "/user-profile/inquiries",
        icon: "MessageSquare",
      },
      {
        label: "Zprávy",
        href: "/user-profile/messages",
        icon: "MessageCircle",
      },
      { label: "Oblíbené", href: "/user-profile/favourites", icon: "Heart" },
    ],
    subMenuItems: [
      {
        label: "Nastavení",
        href: "/user-profile/profile-settings",
        icon: "Settings",
      },
      {
        label: "Odejít",
        href: "/homepage",
        icon: "LogOut",
      },
    ],
  };

  queryClient.prefetchQuery({
    queryKey: eventKeys.all(),
    queryFn: () => fetchEvents(),
  });

  queryClient.prefetchQuery({
    queryKey: inquiryKeys.all(),
    queryFn: () => fetchInquiries(),
  });

  return (
    <>
      <Sidebar {...sidebar} />
      <ContentWrapper>
        <HydrationBoundary state={dehydrate(queryClient)}>
          {children}
        </HydrationBoundary>
      </ContentWrapper>
    </>
  );
}
