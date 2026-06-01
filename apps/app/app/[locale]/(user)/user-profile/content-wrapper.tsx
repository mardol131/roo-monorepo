"use client";

import { usePathname } from "@/app/i18n/navigation";
import React, { PropsWithChildren, useMemo } from "react";
import Sidebar, { SidebarProps } from "../components/sidebar";
import Navbar from "../components/navbar";
import { useParams } from "next/navigation";
import { useEvent } from "@/app/react-query/events/hooks";
import { SubSidebar, SubSidebarProps } from "../components/sub-sidebar";

export default function ContentWrapper({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const { eventId } = useParams<{ eventId?: string }>();
  const { data: event } = useEvent(eventId);

  const dontRestraintWidth =
    pathname.endsWith("/edit") || pathname.endsWith("/new");

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
  };

  const subSidebarData: SubSidebarProps | undefined = useMemo(() => {
    if (!event || !eventId) return undefined;

    const mainMenuItems: SubSidebarProps["mainMenuItems"] = [
      {
        label: "Přehled",
        href: {
          pathname: "/user-profile/events/[eventId]",
          params: { eventId },
        },
        icon: "Calendar",
      },

      {
        label: "Nastavení události",
        href: {
          pathname: "/user-profile/events/[eventId]/edit",
          params: { eventId },
        },
        icon: "Settings",
      },
      {
        label: "Poptávky",
        href: {
          pathname: "/user-profile/events/[eventId]/inquiries",
          params: { eventId },
        },
        icon: "MessageSquare",
      },
      {
        label: "Úkoly",
        href: {
          pathname: "/user-profile/events/[eventId]/tasks",
          params: { eventId },
        },
        icon: "CheckSquare",
      },
      {
        label: "Poznámky",
        href: {
          pathname: "/user-profile/events/[eventId]/notes",
          params: { eventId },
        },
        icon: "StickyNote",
      },
    ];

    const subSidebar: SubSidebarProps = {
      mainMenuItems,
      mainMenuLabel: {
        label: "Vaše událost",
        sublabel: event.name,
        icon: "Calendar",
      },
    };

    return subSidebar;
  }, [event, eventId]);
  return (
    <>
      <Sidebar {...sidebar} />
      {event && subSidebarData && <SubSidebar {...subSidebarData} />}

      <div className="flex-1 flex flex-col justify-start items-center">
        <Navbar />
        <div
          className={`w-full flex flex-col px-8 py-20 ${dontRestraintWidth ? "max-w-user-profile-content-form" : "max-w-user-profile-content"}`}
        >
          {children}
        </div>
      </div>
    </>
  );
}
