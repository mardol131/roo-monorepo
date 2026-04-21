"use client";

import { IntlPathname, usePathname } from "@/app/i18n/navigation";
import {
  Briefcase,
  Building2,
  Calendar,
  LandPlot,
  Layers,
  LayoutDashboard,
  LogOut,
  MessageCircle,
  MessageSquare,
  Plus,
  Settings,
} from "lucide-react";
import React, { useCallback, useMemo } from "react";
import Sidebar, { SidebarProps } from "../components/sidebar";
import { useCompany } from "@/app/react-query/companies/hooks";
import { useParams } from "next/dist/client/components/navigation";
import { SubSidebar, SubSidebarProps } from "../components/sub-sidebar";
import { useListing } from "@/app/react-query/listings/hooks";
import { SidebarItem } from "../components/sidebar-item";

type Props = {
  children: React.ReactNode;
};

export default function layout({ children }: Props) {
  const sidebarProps: SidebarProps = {
    mainMenuItems: [
      { label: "Přehled", href: "/company-profile", icon: LayoutDashboard },
      { label: "Firmy", href: "/company-profile/companies", icon: Building2 },
      {
        label: "Přidat firmu",
        href: "/company-profile/companies/new",
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
  };

  const { companyId, listingId } = useParams<{
    companyId?: string;
    listingId?: string;
  }>();

  const { data: company } = useCompany(companyId);

  const { data: listing } = useListing(listingId);

  const subSidebarData: SubSidebarProps | undefined = useMemo(() => {
    if (!company || !companyId) return undefined;

    const mainMenuItems: SubSidebarProps["mainMenuItems"] = [
      {
        label: "Přehled",
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
        label: "Nastavení",
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
            label: "Přehled",
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
            label: "Varianty",
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
          ...(listing?.details[0]?.blockType === "venue"
            ? [spaceMenuItem]
            : []),
        ]
      : undefined;

    const subSidebar: SubSidebarProps = {
      mainMenuItems,
      subMenuItems,
      mainMenuLabel: "Navigace firmy",
      subMenuLabel: listingId ? "Navigace služby" : undefined,
    };

    return subSidebar;
  }, [company, listing]);
  return (
    <>
      <Sidebar {...sidebarProps} />
      {company && subSidebarData && <SubSidebar {...subSidebarData} />}
      {children}
    </>
  );
}
