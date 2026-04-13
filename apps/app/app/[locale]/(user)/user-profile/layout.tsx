"use client";

import { IntlPathname, usePathname } from "@/app/i18n/navigation";
import {
  Calendar,
  Heart,
  LayoutDashboard,
  LogOut,
  MessageCircle,
  MessageSquare,
  Plus,
  Settings,
} from "lucide-react";
import React, { useCallback } from "react";
import Sidebar, { SidebarProps } from "../components/sidebar";

type Props = {
  children: React.ReactNode;
};

export default function layout({ children }: Props) {
  const pathname = usePathname();

  const isActive = useCallback(
    (href: IntlPathname) => {
      if (typeof href === "string") {
        return pathname === href;
      } else {
        return pathname.startsWith(href.pathname);
      }
    },
    [pathname],
  );
  const sidebar: SidebarProps = {
    mainMenuItems: [
      { label: "Přehled", href: "/user-profile", icon: LayoutDashboard },
      {
        label: "Nová událost",
        href: "/user-profile/new",
        icon: Plus,
      },
      {
        label: "Události",
        href: "/user-profile/my-events",
        icon: Calendar,
      },
      {
        label: "Poptávky",
        href: "/user-profile/inquiries",
        icon: MessageSquare,
      },
      { label: "Zprávy", href: "/user-profile/messages", icon: MessageCircle },
      { label: "Oblíbené", href: "/user-profile/favorites", icon: Heart },
    ],
    subMenuItems: [
      { label: "Nastavení", href: "/user-profile/messages", icon: Settings },
      { label: "Odhlásit se", href: "/user-profile/favorites", icon: LogOut },
    ],
    isActiveFunction: isActive,
  };
  return (
    <>
      <Sidebar {...sidebar} />
      <div className="flex-1 flex justify-center">
        <div className="max-w-user-profile-content w-full flex flex-col px-8 py-20">
          {children}
        </div>
      </div>
    </>
  );
}
