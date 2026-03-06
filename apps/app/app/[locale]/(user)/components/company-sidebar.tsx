"use client";

import Button, { ButtonProps } from "@/app/components/ui/atoms/button";
import Text from "@/app/components/ui/atoms/text";
import { IntlPathname, Link, usePathname } from "@/app/i18n/navigation";
import { useLocale } from "next-intl";
import { useCallback } from "react";
import { Building2, LucideIcon, User } from "lucide-react";
import { SidebarItem } from "./sidebar";
import ProfileSwitchButton from "./profile-switch-button";

// Placeholder user — swap for real auth data later
const USER = {
  name: "Jan Novák",
  email: "jan.novak@email.cz",
  initials: "JN",
};

export type CompanySidebarProps = {
  button?: ButtonProps;
  mainMenuItems: SidebarItem[];
  subMenuItems?: SidebarItem[];
  headerComponent?: React.ReactNode;
};

export default function CompanySidebar({
  button,
  mainMenuItems,
  subMenuItems,
  headerComponent,
}: CompanySidebarProps) {
  // next-intl usePathname returns localized path: /ucet, /ucet/moje-udalosti, ...
  const pathname = usePathname();
  const locale = useLocale();

  const isActive = useCallback(
    (href: IntlPathname) => {
      if (typeof href === "string") {
        return href === pathname;
      } else {
        return href.pathname === pathname;
      }
    },
    [pathname, locale],
  );

  return (
    <aside className="w-64 shrink-0 flex flex-col bg-white border-r border-zinc-200">
      <div className="sticky top-0">
        {headerComponent}
        {<ProfileSwitchButton />}

        {button && (
          <div className="px-3 pt-4 pb-2">
            <Button {...button} />
          </div>
        )}

        {/* Main navigation */}
        <nav className="flex-1 px-3 py-2 overflow-y-auto">
          <ul className="flex flex-col gap-0.5">
            {mainMenuItems.map(({ label, href, icon, onClick }) => {
              const active = isActive(href);
              const Icon = icon;

              return (
                <li key={href.toString()}>
                  <Link
                    onClick={onClick}
                    href={href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      active
                        ? "bg-rose-50 text-rose-600"
                        : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 shrink-0 ${active ? "text-rose-500" : "text-zinc-400"}`}
                    />
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom submenu */}
        <div className="px-3 py-3 border-t border-zinc-100">
          <ul className="flex flex-col gap-0.5">
            {subMenuItems &&
              subMenuItems.map(({ label, href, icon, onClick }) => {
                const active = isActive(href);
                const Icon = icon;

                return (
                  <li key={href.toString()}>
                    <Link
                      onClick={onClick}
                      href={href}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        active
                          ? "bg-rose-50 text-rose-600"
                          : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                      }`}
                    >
                      <Icon
                        className={`w-4 h-4 shrink-0 ${active ? "text-rose-500" : "text-zinc-400"}`}
                      />
                      {label}
                    </Link>
                  </li>
                );
              })}
          </ul>
        </div>
      </div>
    </aside>
  );
}
