"use client";

import React, { useCallback } from "react";
import { SubSidebar, SubSidebarProps } from "../../../components/sub-sidebar";
import { IntlPathname, usePathname } from "@/app/i18n/navigation";
import {
  Briefcase,
  Calendar,
  LandPlot,
  Layers,
  LayoutDashboard,
  MessageCircle,
  MessageSquare,
  Settings,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useListing } from "@/app/react-query/listings/hooks";
import { SidebarItem } from "../../../components/sidebar-item";

type Props = {
  companyId: string;
};

export default function CustomSidebar({ companyId }: Props) {
  const pathname = usePathname();
  const { listingId } = useParams<{ companyId: string; listingId?: string }>();
  const isActive = useCallback(
    (href: IntlPathname) => {
      const path = typeof href === "string" ? href : href.pathname;
      return pathname === path;
    },
    [pathname],
  );

  const { data } = useListing(listingId);

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

  const spaceMenuItem: SidebarItem = {
    label: "Prostory služby",
    href: {
      pathname:
        "/company-profile/companies/[companyId]/listings/[listingId]/spaces",
      params: { companyId, listingId: listingId! },
    },
    icon: LandPlot,
  };

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
        ...(data?.details[0]?.blockType === "venue"
          ? [spaceMenuItem]
          : []),
      ]
    : undefined;

  const subSidebar: SubSidebarProps = {
    isActiveFunction: isActive,
    mainMenuItems,
    subMenuItems,
    mainMenuLabel: "Navigace firmy",
    subMenuLabel: listingId ? "Navigace služby" : undefined,
  };
  return <SubSidebar {...subSidebar} />;
}
