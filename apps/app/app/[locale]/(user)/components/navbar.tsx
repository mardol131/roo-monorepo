"use client";

import React from "react";
import { useAuth } from "@/app/context/auth/auth-context";
import { usePathname, useRouter } from "@/app/i18n/navigation";
import Button, { ButtonProps } from "@/app/components/ui/atoms/button";

export default function Navbar({ buttons }: { buttons?: ButtonProps[] }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

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
      {hasCompanyRole && (
        <div className="flex items-center gap-0.5 p-0.5 bg-zinc-100 border border-zinc-200 rounded-lg mr-1">
          <Button
            text="Osobní"
            size="sm"
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
            size="sm"
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
        size="sm"
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
