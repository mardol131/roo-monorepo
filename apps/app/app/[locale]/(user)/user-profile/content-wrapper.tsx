"use client";

import { usePathname } from "@/app/i18n/navigation";
import React, { PropsWithChildren } from "react";
import Sidebar, { SidebarProps } from "../components/sidebar";
import Navbar from "../components/navbar";

export default function ContentWrapper({ children }: PropsWithChildren) {
  const pathname = usePathname();

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
  return (
    <>
      <Sidebar {...sidebar} />
      <div className="flex-1 flex flex-col justify-start items-center">
        <Navbar
          buttons={[
            {
              text: "Nastavení",
              size: "xs",
              version: "plain",
              iconLeft: "Settings",
              link: "/user-profile/profile-settings",
            },
            {
              text: "Odejít",
              size: "xs",
              version: "plain",
              iconLeft: "ExternalLink",
              link: "/homepage",
            },
          ]}
        />
        <div
          className={`w-full flex flex-col px-8 py-20 ${dontRestraintWidth ? "max-w-user-profile-content-form" : "max-w-user-profile-content"}`}
        >
          {children}
        </div>
      </div>
    </>
  );
}
