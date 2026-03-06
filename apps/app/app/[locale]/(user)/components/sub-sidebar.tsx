"use client";

import Button, { ButtonProps } from "@/app/components/ui/atoms/button";
import { IntlPathname, Link } from "@/app/i18n/navigation";
import { SidebarItem } from "./sidebar";
import Text from "@/app/components/ui/atoms/text";

export type SubSidebarProps = {
  headerComponent?: React.ReactNode;
  submenuComponent?: React.ReactNode;
  button?: ButtonProps;
  mainMenuLabel?: string;
  mainMenuItems: SidebarItem[];
  subMenuLabel?: string;
  subMenuItems?: SidebarItem[];
  isActiveFunction: (href: IntlPathname) => boolean;
};

export function SubSidebar({
  headerComponent,
  submenuComponent,
  button,
  mainMenuItems,
  subMenuItems,
  mainMenuLabel,
  subMenuLabel,
  isActiveFunction,
}: SubSidebarProps) {
  return (
    <aside className="w-48 shrink-0 flex flex-col bg-white border-r border-zinc-200">
      <div className="sticky top-0 flex flex-col justify-start h-screen">
        {headerComponent}
        {mainMenuLabel && (
          <div className="px-6 py-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
            {mainMenuLabel}
          </div>
        )}

        {button && (
          <div className="px-3 pt-4 pb-2">
            <Button {...button} />
          </div>
        )}

        <nav className=" px-3 py-2 overflow-y-auto">
          <ul className="flex flex-col gap-0.5">
            {mainMenuItems.map(({ label, href, icon: Icon, onClick }) => {
              const active = isActiveFunction(href);
              return (
                <li key={label}>
                  <Link
                    href={href}
                    onClick={onClick}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      active
                        ? "bg-rose-50 text-rose-600"
                        : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 shrink-0 ${active ? "text-rose-500" : "text-zinc-400"}`}
                    />
                    <span className="text-[11px] font-medium leading-tight text-center">
                      {label}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        {subMenuLabel && (
          <div className="px-6 py-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
            {subMenuLabel}
          </div>
        )}
        {submenuComponent}

        {subMenuItems && subMenuItems.length > 0 && (
          <nav className="border-t border-zinc-200 flex-1 px-3 py-2 overflow-y-auto">
            <ul className="flex flex-col gap-0.5">
              {mainMenuItems.map(({ label, href, icon: Icon, onClick }) => {
                const active = isActiveFunction(href);
                return (
                  <li key={label}>
                    <Link
                      href={href}
                      onClick={onClick}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        active
                          ? "bg-rose-50 text-rose-600"
                          : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                      }`}
                    >
                      <Icon
                        className={`w-4 h-4 shrink-0 ${active ? "text-rose-500" : "text-zinc-400"}`}
                      />
                      <span className="text-[11px] font-medium leading-tight text-center">
                        {label}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        )}
      </div>
    </aside>
  );
}
