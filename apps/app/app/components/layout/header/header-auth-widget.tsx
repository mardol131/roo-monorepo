"use client";

import { useAuth } from "@/app/context/auth/auth-context";
import { Link } from "@/app/i18n/navigation";
import Text from "@/app/components/ui/atoms/text";
import {
  Building2,
  Calendar,
  ChevronDown,
  LogOut,
  Settings,
  Star,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { loginModalEvents } from "@/app/components/ui/molecules/modals/login-modal/login-modal";
import Button from "../../ui/atoms/button";
import { getInitials } from "@roo/common";
import { useTranslations } from "next-intl";
import { useClickOutside } from "@/app/hooks/use-click-outside";

export default function HeaderAuthWidget({
  onNavigate,
}: {
  onNavigate?: () => void;
}) {
  const { user, isLoading, isAuthenticated, logout } = useAuth();
  const t = useTranslations("global.header.auth");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useClickOutside(ref, () => setOpen(false));

  if (isLoading && !user) {
    return <div className="w-8 h-8 rounded-full bg-zinc-100 animate-pulse" />;
  }

  if (!isAuthenticated || !user) {
    return (
      <>
        <Button
          text={t("login")}
          onClick={() => {
            onNavigate?.();
            loginModalEvents.emit("open", undefined);
          }}
          size="sm"
          version="plain"
        />
        <Button
          text={t("register")}
          onClick={onNavigate}
          link={{
            pathname: "/register",
          }}
          size="sm"
          rounding="lg"
          version="primary"
        />
      </>
    );
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-2 p-2 rounded-full bg-zinc-100 hover:bg-zinc-200 transition-colors"
      >
        <div className="w-7 h-7 rounded-full bg-zinc-900 text-white flex items-center justify-center text-xs font-semibold shrink-0">
          {getInitials(user.firstName, user.lastName)}
        </div>
        <Text
          variant="label-lg"
          color="textDark"
          className="hidden lg:block max-w-35 truncate"
        >
          {user.email}
        </Text>
        <ChevronDown
          className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-150 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-zinc-200 rounded-xl shadow-lg z-50 py-1.5 overflow-hidden">
          <div className="px-3 flex flex-col py-2 border-b border-zinc-100 mb-1">
            <Text
              variant="label"
              color="textDark"
              className="font-semibold truncate"
            >
              {user.firstName} {user.lastName}
            </Text>
            <Text variant="caption" color="secondary" className="truncate">
              {user.email}
            </Text>
          </div>

          <Link
            href={{ pathname: "/user-profile" }}
            onClick={() => {
              setOpen(false);
              onNavigate?.();
            }}
            className="flex items-center gap-2.5 px-3 py-2 hover:bg-zinc-50 transition-colors"
          >
            <Settings className="w-4 h-4 text-zinc-400 shrink-0" />
            <Text variant="label-lg" color="textDark">
              {t("userAdmin")}
            </Text>
          </Link>
          <Link
            href={{ pathname: "/user-profile/events" }}
            onClick={() => {
              setOpen(false);
              onNavigate?.();
            }}
            className="flex items-center gap-2.5 px-3 py-2 hover:bg-zinc-50 transition-colors"
          >
            <Calendar className="w-4 h-4 text-zinc-400 shrink-0" />
            <Text variant="label-lg" color="textDark">
              {t("myEvents")}
            </Text>
          </Link>
          <Link
            href={{ pathname: "/user-profile/favourites" }}
            onClick={() => {
              setOpen(false);
              onNavigate?.();
            }}
            className="flex items-center gap-2.5 px-3 py-2 hover:bg-zinc-50 transition-colors"
          >
            <Star className="w-4 h-4 text-zinc-400 shrink-0" />
            <Text variant="label-lg" color="textDark">
              {t("favourites")}
            </Text>
          </Link>

          {user.roles.includes("company") && (
            <>
              <div className="border-t border-zinc-100 mt-1 pt-1 mb-1">
                <Text variant="caption" color="secondary" className="px-3 py-1">
                  {t("supplierSection")}
                </Text>
                <Link
                  href={{ pathname: "/company-profile/companies" }}
                  onClick={() => {
                    setOpen(false);
                    onNavigate?.();
                  }}
                  className="flex items-center gap-2.5 px-3 py-2 hover:bg-zinc-50 transition-colors"
                >
                  <Building2 className="w-4 h-4 text-zinc-400 shrink-0" />
                  <Text variant="label-lg" color="textDark">
                    {t("companyAdmin")}
                  </Text>
                </Link>
              </div>
            </>
          )}

          <div className="border-t border-zinc-100 mt-1 pt-1">
            <button
              type="button"
              onClick={async () => {
                setOpen(false);
                onNavigate?.();
                await logout();
              }}
              className="w-full cursor-pointer flex items-center gap-2.5 px-3 py-2 hover:bg-rose-50 transition-colors"
            >
              <LogOut className="w-4 h-4 shrink-0 text-danger" />
              <Text variant="label-lg" color="danger">
                {t("logout")}
              </Text>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
