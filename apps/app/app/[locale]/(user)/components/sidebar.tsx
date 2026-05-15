"use client";

import Button, { ButtonProps } from "@/app/components/ui/atoms/button";
import { IntlPathname, Link, usePathname } from "@/app/i18n/navigation";
import { LucideIcon } from "lucide-react";
import Image from "next/image";
import logo from "../../../../public/logo.png";
import ProfileSwitchButton from "./profile-switch-button";
import { SidebarItem, SidebarNavItem } from "./sidebar-item";
import { useCallback } from "react";
import { useAuth } from "@/app/context/auth/auth-context";

export type SidebarProps = {
  button?: ButtonProps;
  mainMenuItems: SidebarItem[];
  subMenuItems?: SidebarItem[];
  headerComponent?: React.ReactNode;
};

export default function Sidebar({ mainMenuItems, subMenuItems }: SidebarProps) {
  const pathname = usePathname();

  const auth = useAuth();

  const isActive = useCallback(
    (href?: IntlPathname) => {
      if (!href) return false;
      if (typeof href === "string") {
        if (href === "/company-profile" || href === "/user-profile")
          return pathname === href;
        return pathname.startsWith(href);
      } else if ("params" in href) {
        const { pathname: hrefPathname } = href;
        return pathname === hrefPathname;
      } else return false;
    },
    [pathname],
  );
  return (
    <aside className="w-20 shrink-0 flex flex-col bg-white border-r border-zinc-200">
      <div className="sticky top-0 flex flex-col h-screen">
        <Image src={logo} alt="Logo" className="p-3" />

        <nav className="flex-1 px-2 py-3 overflow-y-auto">
          <ul className="flex flex-col gap-1">
            {mainMenuItems.map((item) => (
              <SidebarNavItem
                key={item.href?.toString() || item.label}
                {...item}
                active={isActive(item.href)}
              />
            ))}
          </ul>
        </nav>

        {subMenuItems && subMenuItems.length > 0 && (
          <div className="px-2 py-2 border-zinc-100">
            <ul className="flex flex-col gap-2">
              {auth.user?.type == "company" && (
                <>
                  <div className="h-px bg-zinc-200"></div>
                  <div>
                    <ProfileSwitchButton />
                  </div>
                </>
              )}
              <div className="h-px bg-zinc-200"></div>
              {subMenuItems.map((item) => (
                <SidebarNavItem
                  key={item.href?.toString() || item.label}
                  {...item}
                  active={isActive(item.href)}
                />
              ))}
            </ul>
          </div>
        )}
      </div>
    </aside>
  );
}
