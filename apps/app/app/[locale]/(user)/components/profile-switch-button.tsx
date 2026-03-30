"use client";

import { usePathname } from "@/app/i18n/navigation";
import { Building2, User } from "lucide-react";
import { SidebarNavItem } from "./sidebar-item";

export default function ProfileSwitchButton() {
  const pathname = usePathname();

  return (
    <div className="py-2 border-b border-zinc-100 flex flex-col w-full gap-1">
      <SidebarNavItem
        label="Osobní"
        href="/user-profile"
        icon={User}
        active={pathname.startsWith("/user-profile")}
      />
      <SidebarNavItem
        label="Firemní"
        href="/company-profile"
        icon={Building2}
        active={pathname.startsWith("/company-profile")}
      />
    </div>
  );
}
