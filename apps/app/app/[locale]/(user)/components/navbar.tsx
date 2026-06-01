"use client";

import { useRef, useState } from "react";
import { useAuth } from "@/app/context/auth/auth-context";
import { usePathname, useRouter } from "@/app/i18n/navigation";
import Button from "@/app/components/ui/atoms/button";
import NotificationButton from "./notification-button";
import Input from "@/app/components/ui/atoms/inputs/input";
import { useClickOutside } from "@/app/hooks/use-click-outside";
import { NavbarSearchDropdown } from "./navbar-search-dropdown";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [search, setSearch] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useClickOutside(searchContainerRef, () => {
    setIsSearchOpen(false);
    setSearch("");
  });

  const initials = user
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : "?";

  const hasCompanyRole = user?.roles.includes("company");
  const isOnCompanyProfile = pathname.startsWith("/company-profile");

  const handleLogout = async () => {
    await logout();
    router.push("/homepage");
  };

  const handleProfileSettingsClick = () => {
    if (pathname.startsWith("/company-profile")) {
      router.push("/company-profile/profile-settings");
    } else {
      router.push("/user-profile/profile-settings");
    }
  };

  return (
    <div className="h-12 border-b sticky top-0 z-10 w-full bg-white border-zinc-200 flex items-center justify-between px-4 gap-2">
      <div ref={searchContainerRef} className="relative">
        <Input
          size="sm"
          placeholder="Vyhledávání"
          inputProps={{
            value: search,
            onChange: (e) => setSearch(e.target.value),
            onFocus: () => setIsSearchOpen(true),
          }}
        />
        {isSearchOpen && user && search.length > 0 && (
          <NavbarSearchDropdown
            search={search}
            isOpen={isSearchOpen}
            userId={user.id}
            isCompanyProfile={isOnCompanyProfile}
          />
        )}
      </div>
      <div className="flex items-center justify-end gap-2">
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
        <NotificationButton />
        <Button
          text="Nastavení a média"
          size="xs"
          version="plain"
          iconLeft="Settings"
          onClick={handleProfileSettingsClick}
        />
        <Button
          text="Odejít"
          size="xs"
          version="plain"
          iconLeft="ExternalLink"
          link="/homepage"
        />
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
    </div>
  );
}
