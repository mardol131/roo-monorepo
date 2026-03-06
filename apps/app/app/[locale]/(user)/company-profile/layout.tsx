"use client";

import React, { useCallback } from "react";
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
import Sidebar, { SidebarProps } from "../components/sidebar";
import Text from "@/app/components/ui/atoms/text";
import { USER } from "./_mock/mock";
import CompanySidebar from "../components/company-sidebar";
import { IntlPathname, usePathname } from "@/app/i18n/navigation";

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
      {
        label: "Přidat firmu",
        href: "/company-profile/new-company",
        icon: Plus,
      },
      {
        label: "Moje firmy",
        href: "/company-profile/companies",
        icon: Calendar,
      },
    ],
    subMenuItems: [
      { label: "Nastavení", href: "/company-profile/settings", icon: Settings },
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
