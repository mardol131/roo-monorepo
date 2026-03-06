"use client";

import React, { useCallback } from "react";
import { SubSidebar, SubSidebarProps } from "../../../components/sub-sidebar";
import {
  Calendar,
  Heart,
  LayoutDashboard,
  MessageCircle,
  MessageSquare,
} from "lucide-react";
import { IntlPathname, usePathname } from "@/app/i18n/navigation";
import CompanySwitcher from "./components/company-switcher";
import { COMPANIES } from "../../_mock/mock";
import ListingSwitcher from "./components/listing-switcher";

type Props = {
  children: React.ReactNode;
  params: Promise<{ companyId: string }>;
};

export default function layout({ children, params }: Props) {
  const { companyId } = React.use(params);
  const pathname = usePathname();

  const isActive = useCallback(
    (href: IntlPathname) => {
      if (typeof href === "string") {
        return pathname === href;
      } else {
        return pathname.startsWith(
          href.pathname
            .replace("[companyId]", companyId)
            .replace(/\/\[.*?\]/g, ""),
        );
      }
    },
    [pathname, companyId],
  );

  const subSidebarMainMenuItems: SubSidebarProps["mainMenuItems"] = [
    {
      label: "Přehled firmy",
      href: {
        pathname: "/company-profile/companies/[companyId]",
        params: { companyId },
      },
      icon: LayoutDashboard,
    },
    {
      label: "Inzeráty",
      href: {
        pathname: "/company-profile/companies/[companyId]/listings",
        params: { companyId },
      },
      icon: Calendar,
    },
    {
      label: "Údaje firmy",
      href: {
        pathname: "/company-profile/companies/[companyId]/edit",
        params: { companyId },
      },
      icon: MessageSquare,
    },
  ];

  const subSidebarSubMenuItems: SubSidebarProps["mainMenuItems"] = [
    {
      label: "Přehled firmy",
      href: {
        pathname: "/company-profile/companies/[companyId]",
        params: { companyId },
      },
      icon: LayoutDashboard,
    },
    {
      label: "Inzeráty",
      href: {
        pathname: "/company-profile/companies/[companyId]/listings",
        params: { companyId },
      },
      icon: Calendar,
    },
    {
      label: "Údaje firmy",
      href: {
        pathname: "/company-profile/companies/[companyId]/edit",
        params: { companyId },
      },
      icon: MessageSquare,
    },
  ];

  const subSidebar: SubSidebarProps = {
    isActiveFunction: isActive,
    headerComponent: companyId ? (
      <CompanySwitcher companies={COMPANIES} currentCompanyId={companyId} />
    ) : undefined,
    submenuComponent: companyId ? (
      <div>
        <ListingSwitcher companies={COMPANIES} currentCompanyId={companyId} />
      </div>
    ) : undefined,
    mainMenuItems: subSidebarMainMenuItems,
    subMenuItems: subSidebarSubMenuItems,
    mainMenuLabel: "Navigace firmy",
    subMenuLabel: "Navigace nabídky",
  };

  return (
    <>
      <SubSidebar {...subSidebar} />
      <div className="flex-1 flex justify-center">
        <div className="max-w-user-profile-content w-full flex flex-col px-8 py-20">
          {children}
        </div>
      </div>
    </>
  );
}
