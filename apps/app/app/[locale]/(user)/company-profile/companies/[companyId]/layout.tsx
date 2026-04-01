"use client";

import { IntlPathname, usePathname } from "@/app/i18n/navigation";
import { useParams } from "next/navigation";
import {
  Briefcase,
  Calendar,
  Layers,
  LayoutDashboard,
  MessageCircle,
  MessageSquare,
  Settings,
} from "lucide-react";
import React, { useCallback } from "react";
import { SubSidebar, SubSidebarProps } from "../../../components/sub-sidebar";

type Props = {
  children: React.ReactNode;
  params: Promise<{ companyId: string }>;
};

export default function layout({ children, params }: Props) {
  const { companyId } = React.use(params);
  const pathname = usePathname();

  const routeParams = useParams();
  const listingId =
    typeof routeParams.listingId === "string" ? routeParams.listingId : null;

  const isActive = useCallback(
    (href: IntlPathname) => {
      const path = typeof href === "string" ? href : href.pathname;
      return pathname === path;
    },
    [pathname],
  );

  const mainMenuItems: SubSidebarProps["mainMenuItems"] = [
    {
      label: "Přehled firmy",
      href: {
        pathname: "/company-profile/companies/[companyId]",
        params: { companyId },
      },
      icon: LayoutDashboard,
    },
    {
      label: "Služby",
      href: {
        pathname: "/company-profile/companies/[companyId]/listings",
        params: { companyId },
      },
      icon: Briefcase,
    },
    {
      label: "Nastavení firmy",
      href: {
        pathname: "/company-profile/companies/[companyId]/edit",
        params: { companyId },
      },
      icon: Settings,
    },
  ];

  const subMenuItems: SubSidebarProps["subMenuItems"] = listingId
    ? [
        {
          label: "Přehled služby",
          href: {
            pathname:
              "/company-profile/companies/[companyId]/listings/[listingId]",
            params: { companyId, listingId },
          },
          icon: LayoutDashboard,
        },
        {
          label: "Poptávky",
          href: {
            pathname:
              "/company-profile/companies/[companyId]/listings/[listingId]/inquiries",
            params: { companyId, listingId },
          },
          icon: MessageSquare,
        },
        {
          label: "Zprávy",
          href: {
            pathname:
              "/company-profile/companies/[companyId]/listings/[listingId]/messages",
            params: { companyId, listingId },
          },
          icon: MessageCircle,
        },

        {
          label: "Kalendář",
          href: {
            pathname:
              "/company-profile/companies/[companyId]/listings/[listingId]/calendar",
            params: { companyId, listingId },
          },
          icon: Calendar,
        },
        {
          label: "Nabízené varianty",
          href: {
            pathname:
              "/company-profile/companies/[companyId]/listings/[listingId]/variants",
            params: { companyId, listingId },
          },
          icon: Layers,
        },
        {
          label: "Nastavení služby",
          href: {
            pathname:
              "/company-profile/companies/[companyId]/listings/[listingId]/edit",
            params: { companyId, listingId },
          },
          icon: Settings,
        },
      ]
    : undefined;

  const subSidebar: SubSidebarProps = {
    isActiveFunction: isActive,
    mainMenuItems,
    subMenuItems,
    mainMenuLabel: "Navigace firmy",
    subMenuLabel: listingId ? "Navigace služby" : undefined,
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
