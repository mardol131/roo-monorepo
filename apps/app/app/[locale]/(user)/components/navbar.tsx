"use client";

import React from "react";
import { useAuth } from "@/app/context/auth/auth-context";
import { usePathname, useRouter } from "@/app/i18n/navigation";
import Button, { ButtonProps } from "@/app/components/ui/atoms/button";
import NotificationBell from "./notification-bell";
import { useUserNotifications } from "@/app/react-query/user-notifications/hooks";

export default function Navbar({ buttons }: { buttons?: ButtonProps[] }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { data: notifications } = useUserNotifications();

  const mockNotifications = [
    {
      id: "1",
      user: "mock-user",
      type: "inquiry" as const,
      heading: "Nová poptávka na váš prostor",
      text: "Zákazník Jan Novák poslal poptávku na Prostory U Mostu na 14. června.",
      link: "/company-profile/inquiries/1",
      seen: false,
      seenAt: null,
      clicked: false,
      clickedAt: null,
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      user: "mock-user",
      type: "event" as const,
      heading: "Událost se blíží",
      text: "Váš event Firemní večírek 2026 začíná za 3 dny.",
      link: "/user-profile/events/2",
      seen: true,
      seenAt: new Date().toISOString(),
      clicked: false,
      clickedAt: null,
      updatedAt: new Date().toISOString(),
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    },
  ];

  const initials = user
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : "?";

  const hasCompanyRole = user?.roles.includes("company");
  const isOnCompanyProfile = pathname.startsWith("/company-profile");

  const handleLogout = async () => {
    await logout();
    router.push("/homepage");
  };

  return (
    <div className="h-12 border-b sticky top-0 z-10 w-full bg-white border-zinc-200 flex items-center justify-end px-4 gap-2">
      <NotificationBell notifications={mockNotifications} />
      {hasCompanyRole && (
        <div className="flex items-center gap-0.5 p-0.5 bg-zinc-100 border border-zinc-200 rounded-lg mr-1">
          <Button
            text="Osobní"
            size="xs"
            version="none"
            link="/user-profile"
            rounding="md"
            className={
              !isOnCompanyProfile
                ? "bg-white text-zinc-900 shadow-sm"
                : "text-zinc-500 hover:text-zinc-700"
            }
          />
          <Button
            text="Firemní"
            size="xs"
            version="none"
            link="/company-profile"
            rounding="md"
            className={
              isOnCompanyProfile
                ? "bg-white text-zinc-900 shadow-sm"
                : "text-zinc-500 hover:text-zinc-700"
            }
          />
        </div>
      )}

      {buttons &&
        buttons.map((button, index) => <Button key={index} {...button} />)}

      <Button
        text="Odhlásit"
        size="xs"
        version="plain"
        iconLeft="LogOut"
        onClick={handleLogout}
      />

      <div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-xs font-semibold shrink-0">
        {initials}
      </div>
    </div>
  );
}
