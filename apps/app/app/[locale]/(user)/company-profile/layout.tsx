"use client";

import { IntlPathname, usePathname } from "@/app/i18n/navigation";
import {
  Building2,
  LayoutDashboard,
  LogOut,
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
  const sidebarProps: SidebarProps = {
    mainMenuItems: [
      { label: "Přehled", href: "/company-profile", icon: LayoutDashboard },
      { label: "Firmy", href: "/company-profile/companies", icon: Building2 },
      {
        label: "Přidat firmu",
        href: "/company-profile/new-company",
        icon: Plus,
      },
    ],
    subMenuItems: [
      {
        label: "Nastavení",
        href: "/company-profile/profile-settings",
        icon: Settings,
      },
      { label: "Odhlásit se", href: "/homepage", icon: LogOut },
    ],
    isActiveFunction: isActive,
  };
  return (
    <>
      <Sidebar {...sidebarProps} />
      {children}
    </>
  );
}
