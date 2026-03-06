"use client";

import Button, { ButtonProps } from "@/app/components/ui/atoms/button";
import Text from "@/app/components/ui/atoms/text";
import { IntlPathname, Link, usePathname } from "@/app/i18n/navigation";
import { useLocale } from "next-intl";
import { useCallback } from "react";
import { Building2, LucideIcon, User } from "lucide-react";
import ProfileSwitchButton from "./profile-switch-button";
import Image from "next/image";
import logo from "../../../../public/logo.png";

// Placeholder user — swap for real auth data later
const USER = {
  name: "Jan Novák",
  email: "jan.novak@email.cz",
  initials: "JN",
};

export type SidebarItem = {
  label: string;
  href: IntlPathname;
  icon: LucideIcon;
  onClick?: () => void;
};

export type SidebarProps = {
  button?: ButtonProps;
  mainMenuItems: SidebarItem[];
  subMenuItems?: SidebarItem[];
  headerComponent?: React.ReactNode;
  isActiveFunction: (href: IntlPathname) => boolean;
};

export default function Sidebar({
  button,
  mainMenuItems,
  subMenuItems,
  headerComponent,
  isActiveFunction,
}: SidebarProps) {
  // next-intl usePathname returns localized path: /ucet, /ucet/moje-udalosti, ...
  const pathname = usePathname();
  const locale = useLocale();

  return (
    <aside className="w-18 shrink-0 flex flex-col bg-white border-r border-zinc-200">
      <div className="sticky top-0 flex flex-col h-screen">
        <Image src={logo} alt="Logo" className="p-3" />
        {headerComponent}

        {button && (
          <div className="flex justify-center py-3 border-b border-zinc-100">
            <Button {...button} />
          </div>
        )}

        {/* Main navigation */}
        <nav className="flex-1 px-2 py-3 overflow-y-auto">
          <ul className="flex flex-col gap-1">
            {mainMenuItems.map(({ label, href, icon, onClick }) => {
              const active = isActiveFunction(href);
              const Icon = icon;

              return (
                <li key={href.toString()}>
                  <Link
                    onClick={onClick}
                    href={href}
                    className={`flex flex-col items-center gap-1 px-1 py-2.5 rounded-xl transition-all ${
                      active
                        ? "bg-rose-50 text-primary"
                        : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 shrink-0 ${active ? "text-primary" : "text-zinc-400"}`}
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

        {/* Bottom submenu */}
        {subMenuItems && subMenuItems.length > 0 && (
          <div className="px-2 pb-3 border-t border-zinc-100">
            <ul className="flex flex-col gap-1">
              {<ProfileSwitchButton />}

              {subMenuItems.map(({ label, href, icon, onClick }) => {
                const active = isActiveFunction(href);
                const Icon = icon;

                return (
                  <li key={href.toString()}>
                    <Link
                      onClick={onClick}
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
          </div>
        )}
      </div>
    </aside>
  );
}
