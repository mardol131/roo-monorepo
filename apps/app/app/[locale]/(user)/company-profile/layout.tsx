"use client";

import React, { useCallback } from "react";
import {
  Building2,
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
      { label: "Firmy", href: "/company-profile", icon: Building2 },
      {
        label: "Přidat firmu",
        href: "/company-profile/new-company",
        icon: Plus,
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
