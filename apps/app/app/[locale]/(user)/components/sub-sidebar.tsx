"use client";

import { IntlPathname, Link, usePathname } from "@/app/i18n/navigation";
import { SidebarItem } from "./sidebar-item";
import { LucideIcons } from "@roo/common";
import * as lucideIcons from "lucide-react";
import React, { useCallback } from "react";
import Text, { TextProps } from "@/app/components/ui/atoms/text";

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
  mainMenuLabel?: {
    label: string;
    sublabel?: string;
    icon?: LucideIcons;
  };
  mainMenuItems: SidebarItem[];
  subMenuLabel?: {
    label: string;
    sublabel?: string;
    icon?: LucideIcons;
  };
  subMenuItems?: SidebarItem[];
};

export function SubSidebar({
  mainMenuLabel,
  mainMenuItems,
  subMenuLabel,
  subMenuItems,
}: SubSidebarProps) {
  const pathname = usePathname();

  const isActive = useCallback(
    (href?: IntlPathname) => {
      if (!href) return false;
      if (typeof href === "string") {
        return pathname === href;
      } else if ("params" in href) {
        const { pathname: hrefPathname } = href;
        return pathname === hrefPathname;
      } else {
        return pathname.startsWith(href.pathname);
      }
    },
    [pathname],
  );
  return (
    <aside className="w-48 shrink-0 flex flex-col bg-white border-r border-zinc-200">
      <div className="sticky top-0 flex flex-col h-screen">
        {mainMenuLabel && (
          <SectionLabel
            label={mainMenuLabel.label}
            sublabel={mainMenuLabel.sublabel}
            variant="company"
            icon={mainMenuLabel.icon || "Building2"}
            iconBgColor="bg-company-surface"
            iconColor="text-company"
            labelColor="company"
          />
        )}

        <nav className="px-3 py-2">
          <ul className="flex flex-col gap-0.5">
            {mainMenuItems.map((item) => (
              <SubSidebarNavItem
                key={item.label}
                {...item}
                active={isActive(item.href)}
                variant="company"
              />
            ))}
          </ul>
        </nav>

        {subMenuItems && subMenuItems.length > 0 && (
          <div className="border-t border-zinc-100 flex flex-col flex-1 overflow-y-auto">
            {subMenuLabel && (
              <SectionLabel
                label={subMenuLabel.label}
                sublabel={subMenuLabel.sublabel}
                variant="listing"
                icon={subMenuLabel.icon || "Tag"}
                iconBgColor="bg-listing-surface"
                iconColor="text-listing"
                labelColor="listing"
              />
            )}
            <nav className="px-3 py-2">
              <ul className="flex flex-col gap-0.5">
                {subMenuItems.map((item) => (
                  <SubSidebarNavItem
                    key={item.label}
                    {...item}
                    active={isActive(item.href)}
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
  sublabel,
  labelColor,
  subLabelColor,
  variant,
  icon,
  iconColor,
  iconBgColor,
}: {
  label: string;
  sublabel?: string;
  labelColor?: TextProps["color"];
  subLabelColor?: TextProps["color"];
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
      className={`px-4 pt-4 pb-1 text-[12px] font-semibold ${v.label} flex items-start gap-2`}
    >
      <div className={`p-2 ${iconBgColor || v.activeBg} rounded-md`}>
        <IconComponent className={`w-5 h-5 ${iconColor || v.activeIcon}`} />
      </div>
      <div className="flex flex-col">
        <Text variant="label" color={labelColor || "textDark"}>
          {label}
        </Text>
        {sublabel && (
          <Text
            variant="label-sm"
            color={subLabelColor || "textDark"}
            className="font-semibold"
          >
            {sublabel}
          </Text>
        )}
      </div>
    </div>
  );
}

function SubSidebarNavItem({
  label,
  href,
  icon,
  onClick,
  active,
  variant,
}: SidebarItem & { active: boolean; variant: ColorVariant }) {
  const v = variants[variant];
  console.log(v);

  const IconComponent = lucideIcons[icon] as unknown as React.FC<
    React.SVGProps<SVGSVGElement>
  >;
  return (
    <li>
      {href ? (
        <Link
          href={href}
          onClick={onClick}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            active
              ? `${v.activeBg} ${v.activeText}`
              : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
          }`}
        >
          <IconComponent
            className={`w-4 h-4 ${active ? v.activeIcon : "text-zinc-400"}`}
          />
          <Text
            variant="label-sm"
            color="none"
            className={`font-semibold ${active ? v.activeText : "text-secondary"}`}
          >
            {label}
          </Text>
        </Link>
      ) : (
        <button
          onClick={onClick}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            active
              ? `${v.activeBg} ${v.activeText}`
              : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
          }`}
        >
          <IconComponent
            className={`w-4 h-4 ${active ? v.activeIcon : "text-zinc-400"}`}
          />
          <Text
            variant="label-sm"
            color="none"
            className={`font-semibold ${active ? v.activeText : "text-secondary"}`}
          >
            {label}
          </Text>
        </button>
      )}
    </li>
  );
}
