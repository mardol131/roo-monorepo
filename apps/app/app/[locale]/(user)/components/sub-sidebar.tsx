"use client";

import { IntlPathname, Link, usePathname } from "@/app/i18n/navigation";
import { useLocale } from "next-intl";
import {
  Building2,
  CalendarDays,
  ClipboardList,
  LayoutDashboard,
  LucideIcon,
  MessageSquare,
  Pencil,
} from "lucide-react";
import { useCallback } from "react";

type Props = {
  companyId: string;
};

export default function SubSidebar({ companyId }: Props) {
  const pathname = usePathname();
  const locale = useLocale();

  const NAV_ITEMS: { label: string; href: IntlPathname; icon: LucideIcon }[] = [
    {
      label: "Přehled",
      href: {
        pathname: "/company-profile/companies/[companyId]",
        params: { companyId },
      },
      icon: LayoutDashboard,
    },
    {
      label: "Upravit",
      href: {
        pathname: "/company-profile/companies/[companyId]/edit",
        params: { companyId },
      },
      icon: Pencil,
    },
    {
      label: "Nabídky",
      href: {
        pathname: "/company-profile/companies/[companyId]/listings",
        params: { companyId },
      },
      icon: ClipboardList,
    },
    {
      label: "Poptávky",
      href: {
        pathname:
          "/company-profile/companies/[companyId]/listings/[listingsId]/inquiries",
        params: { companyId, listingsId: "all" },
      },
      icon: MessageSquare,
    },
    {
      label: "Kalendář",
      href: {
        pathname:
          "/company-profile/companies/[companyId]/listings/[listingsId]/calendar",
        params: { companyId, listingsId: "all" },
      },
      icon: CalendarDays,
    },
  ];

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
    [pathname, locale, companyId],
  );

  return (
    <aside className="w-16 shrink-0 flex flex-col bg-white border-r border-zinc-100">
      <div className="sticky top-0 flex flex-col">
        {/* Company icon */}
        <div className="py-4 flex justify-center border-b border-zinc-100">
          <div className="w-9 h-9 rounded-xl bg-zinc-100 flex items-center justify-center">
            <Building2 className="w-4 h-4 text-zinc-500" />
          </div>
        </div>

        {/* Navigation */}
        <nav className="px-2 py-3">
          <ul className="flex flex-col gap-1">
            {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
              const active = isActive(href);
              return (
                <li key={label}>
                  <Link
                    href={href}
                    className={`flex flex-col items-center gap-1 px-1 py-2.5 rounded-xl transition-all ${
                      active
                        ? "bg-rose-50 text-rose-600"
                        : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 shrink-0 ${active ? "text-rose-500" : "text-zinc-400"}`}
                    />
                    <span className="text-[10px] font-medium leading-tight text-center">
                      {label}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </aside>
  );
}
