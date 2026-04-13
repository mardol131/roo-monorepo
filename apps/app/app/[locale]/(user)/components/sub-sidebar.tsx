"use client";

import { IntlPathname, Link } from "@/app/i18n/navigation";
import { SidebarItem } from "./sidebar-item";
import { LucideIcons } from "@roo/common";
import * as lucideIcons from "lucide-react";

type ColorVariant = "company" | "listing";

const variants: Record<
  ColorVariant,
  {
    label: string;
    line: string;
    activeBg: string;
    activeText: string;
    activeIcon: string;
  }
> = {
  company: {
    label: "text-company",
    line: "before:bg-company",
    activeBg: "bg-company-surface",
    activeText: "text-company",
    activeIcon: "text-company",
  },
  listing: {
    label: "text-listing",
    line: "before:bg-listing",
    activeBg: "bg-listing-surface",
    activeText: "text-listing",
    activeIcon: "text-listing",
  },
};

export type SubSidebarProps = {
  mainMenuLabel?: string;
  mainMenuItems: SidebarItem[];
  subMenuLabel?: string;
  subMenuItems?: SidebarItem[];
  isActiveFunction: (href: IntlPathname) => boolean;
};

export function SubSidebar({
  mainMenuLabel,
  mainMenuItems,
  subMenuLabel,
  subMenuItems,
  isActiveFunction,
}: SubSidebarProps) {
  return (
    <aside className="w-48 shrink-0 flex flex-col bg-white border-r border-zinc-200">
      <div className="sticky top-0 flex flex-col h-screen">
        {mainMenuLabel && (
          <SectionLabel
            label={mainMenuLabel}
            variant="company"
            icon="Building2"
            iconBgColor="bg-company-surface"
            iconColor="text-company"
          />
        )}

        <nav className="px-3 py-2">
          <ul className="flex flex-col gap-0.5">
            {mainMenuItems.map((item) => (
              <SubSidebarNavItem
                key={item.label}
                {...item}
                active={isActiveFunction(item.href)}
                variant="company"
              />
            ))}
          </ul>
        </nav>

        {subMenuItems && subMenuItems.length > 0 && (
          <div className="border-t border-zinc-100 flex flex-col flex-1 overflow-y-auto">
            {subMenuLabel && (
              <SectionLabel
                label={subMenuLabel}
                variant="listing"
                icon="Briefcase"
                iconBgColor="bg-listing-surface"
                iconColor="text-listing"
              />
            )}
            <nav className="px-3 py-2">
              <ul className="flex flex-col gap-0.5">
                {subMenuItems.map((item) => (
                  <SubSidebarNavItem
                    key={item.label}
                    {...item}
                    active={isActiveFunction(item.href)}
                    variant="listing"
                  />
                ))}
              </ul>
            </nav>
          </div>
        )}
      </div>
    </aside>
  );
}

function SectionLabel({
  label,
  variant,
  icon,
  iconColor,
  iconBgColor,
}: {
  label: string;
  variant: ColorVariant;
  icon: LucideIcons;
  iconColor?: string;
  iconBgColor?: string;
}) {
  const v = variants[variant];

  const IconComponent = lucideIcons[icon] as unknown as React.FC<
    React.SVGProps<SVGSVGElement>
  >;
  return (
    <div
      className={`px-4 pt-4 pb-1 text-[12px] font-semibold ${v.label} flex items-center gap-2`}
    >
      <div className={`p-2 ${iconBgColor || v.activeBg} rounded-md`}>
        <IconComponent
          className={`w-5 h-5 ${iconColor || v.activeIcon} ${iconBgColor || v.activeBg}`}
        />
      </div>
      {label}
    </div>
  );
}

function SubSidebarNavItem({
  label,
  href,
  icon: Icon,
  onClick,
  active,
  variant,
}: SidebarItem & { active: boolean; variant: ColorVariant }) {
  const v = variants[variant];
  return (
    <li>
      <Link
        href={href}
        onClick={onClick}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
          active
            ? `${v.activeBg} ${v.activeText}`
            : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
        }`}
      >
        <Icon
          className={`w-4 h-4 shrink-0 ${active ? v.activeIcon : "text-zinc-400"}`}
        />
        <span className="text-[11px] font-semibold leading-tight">{label}</span>
      </Link>
    </li>
  );
}
