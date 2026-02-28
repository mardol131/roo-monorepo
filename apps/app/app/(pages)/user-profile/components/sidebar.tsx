"use client";

import Button from "@/app/components/ui/atoms/button";
import Text from "@/app/components/ui/atoms/text";
import {
  LayoutDashboard,
  Calendar,
  MessageSquare,
  Heart,
  MessageCircle,
  CreditCard,
  Settings,
  LogOut,
  Plus,
  LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS: { label: string; href: string; icon: LucideIcon }[] = [
  { label: "Přehled", href: "/user-profile", icon: LayoutDashboard },
  { label: "Moje události", href: "/user-profile/my-events", icon: Calendar },
  { label: "Poptávky", href: "/user-profile/inquiries", icon: MessageSquare },
  { label: "Zprávy", href: "/user-profile/messages", icon: MessageCircle },
  { label: "Oblíbené", href: "/user-profile/favorites", icon: Heart },
];

const BOTTOM_ITEMS: { label: string; href: string; icon: LucideIcon }[] = [
  { label: "Nastavení", href: "/user-profile/settings", icon: Settings },
];

// Placeholder user — swap for real auth data later
const USER = {
  name: "Jan Novák",
  email: "jan.novak@email.cz",
  initials: "JN",
};

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/user-profile"
      ? pathname === "/user-profile"
      : pathname.startsWith(href);

  return (
    <aside className="w-64 shrink-0 flex flex-col bg-white border-r border-zinc-200">
      <div className="sticky top-0">
        {" "}
        {/* User info */}
        <div className="p-5 border-b border-zinc-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0">
              <Text variant="label1" color="white" className="font-semibold">
                {USER.initials}
              </Text>
            </div>
            <div className="min-w-0 flex flex-col">
              <Text
                variant="label1"
                color="dark"
                className="font-semibold truncate"
              >
                {USER.name}
              </Text>
              <Text variant="label4" color="secondary" className="truncate">
                {USER.email}
              </Text>
            </div>
          </div>
        </div>
        {/* New event button */}
        <div className="px-3 pt-4 pb-2">
          <Button
            link="/new-event"
            text="Nový event"
            className="w-full"
            iconRight="Plus"
          />
        </div>
        {/* Main navigation */}
        <nav className="flex-1 px-3 py-2 overflow-y-auto">
          <ul className="flex flex-col gap-0.5">
            {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
              const active = isActive(href);
              return (
                <li key={href}>
                  <Link
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
            {BOTTOM_ITEMS.map(({ label, href, icon: Icon }) => {
              const active = isActive(href);
              return (
                <li key={href}>
                  <Link
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
            <li>
              <button
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-zinc-600 hover:bg-red-50 hover:text-red-600 transition-all"
                onClick={() => {
                  /* handle logout */
                }}
              >
                <LogOut className="w-4 h-4 shrink-0 text-zinc-400" />
                Odhlásit se
              </button>
            </li>
          </ul>
        </div>
      </div>
    </aside>
  );
}
