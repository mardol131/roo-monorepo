"use client";

import Button, { ButtonProps } from "@/app/components/ui/atoms/button";
import { IntlPathname, Link } from "@/app/i18n/navigation";
import { LucideIcon } from "lucide-react";
import Image from "next/image";
import logo from "../../../../public/logo.png";
import ProfileSwitchButton from "./profile-switch-button";
import { SidebarItem, SidebarNavItem } from "./sidebar-item";

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

        <nav className="flex-1 px-2 py-3 overflow-y-auto">
          <ul className="flex flex-col gap-1">
            {mainMenuItems.map((item) => (
              <SidebarNavItem
                key={item.href.toString()}
                {...item}
                active={isActiveFunction(item.href)}
              />
            ))}
          </ul>
        </nav>

        {subMenuItems && subMenuItems.length > 0 && (
          <div className="px-2 pb-3 border-t border-zinc-100">
            <ul className="flex flex-col gap-1">
              <ProfileSwitchButton />
              {subMenuItems.map((item) => (
                <SidebarNavItem
                  key={item.href.toString()}
                  {...item}
                  active={isActiveFunction(item.href)}
                />
              ))}
            </ul>
          </div>
        )}
      </div>
    </aside>
  );
}
