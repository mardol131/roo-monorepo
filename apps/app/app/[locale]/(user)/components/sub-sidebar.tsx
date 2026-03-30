"use client";

import { IntlPathname, Link } from "@/app/i18n/navigation";
import { SidebarItem } from "./sidebar-item";

type ColorVariant = "rose" | "violet";

const variants: Record<ColorVariant, { label: string; line: string; activeBg: string; activeText: string; activeIcon: string }> = {
  rose: {
    label: "text-rose-400",
    line: "before:bg-rose-300",
    activeBg: "bg-rose-50",
    activeText: "text-rose-600",
    activeIcon: "text-rose-500",
  },
  violet: {
    label: "text-violet-400",
    line: "before:bg-violet-300",
    activeBg: "bg-violet-50",
    activeText: "text-violet-600",
    activeIcon: "text-violet-500",
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
          <SectionLabel label={mainMenuLabel} variant="rose" />
        )}

        <nav className="px-3 py-2">
          <ul className="flex flex-col gap-0.5">
            {mainMenuItems.map((item) => (
              <SubSidebarNavItem
                key={item.label}
                {...item}
                active={isActiveFunction(item.href)}
                variant="rose"
              />
            ))}
          </ul>
        </nav>

        {subMenuItems && subMenuItems.length > 0 && (
          <div className="border-t border-zinc-100 flex flex-col flex-1 overflow-y-auto">
            {subMenuLabel && (
              <SectionLabel label={subMenuLabel} variant="violet" />
            )}
            <nav className="px-3 py-2">
              <ul className="flex flex-col gap-0.5">
                {subMenuItems.map((item) => (
                  <SubSidebarNavItem
                    key={item.label}
                    {...item}
                    active={isActiveFunction(item.href)}
                    variant="violet"
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

function SectionLabel({ label, variant }: { label: string; variant: ColorVariant }) {
  const v = variants[variant];
  return (
    <div className={`px-4 pt-4 pb-1 text-[11px] font-semibold ${v.label} flex items-center gap-2 before:content-[''] before:block before:h-px before:w-3 ${v.line}`}>
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
        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
          active
            ? `${v.activeBg} ${v.activeText}`
            : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
        }`}
      >
        <Icon
          className={`w-4 h-4 shrink-0 ${active ? v.activeIcon : "text-zinc-400"}`}
        />
        <span className="text-[11px] font-medium leading-tight">{label}</span>
      </Link>
    </li>
  );
}
