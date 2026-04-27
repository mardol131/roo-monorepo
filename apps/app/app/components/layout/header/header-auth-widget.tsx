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

export default function HeaderAuthWidget({
  onNavigate,
}: {
  onNavigate?: () => void;
}) {
  const { user, isLoading, isAuthenticated, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (isLoading) {
    return <div className="w-8 h-8 rounded-full bg-zinc-100 animate-pulse" />;
  }

  if (!isAuthenticated || !user) {
    return (
      <>
        <Button
          text="Přihlásit se"
          onClick={() => {
            onNavigate?.();
            loginModalEvents.emit("open", undefined);
          }}
          size="sm"
          version="plain"
        />
        <Button
          text="Registrovat se"
          onClick={onNavigate}
          link={{
            pathname: "/register",
          }}
          size="md"
          rounding="2xl"
          version="secondary"
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
              Administrace
            </Text>
          </Link>
          <Link
            href={{ pathname: "/user-profile/my-events" }}
            onClick={() => {
              setOpen(false);
              onNavigate?.();
            }}
            className="flex items-center gap-2.5 px-3 py-2 hover:bg-zinc-50 transition-colors"
          >
            <Calendar className="w-4 h-4 text-zinc-400 shrink-0" />
            <Text variant="label-lg" color="textDark">
              Moje události
            </Text>
          </Link>
          <Link
            href={{ pathname: "/user-profile/favorites" }}
            onClick={() => {
              setOpen(false);
              onNavigate?.();
            }}
            className="flex items-center gap-2.5 px-3 py-2 hover:bg-zinc-50 transition-colors"
          >
            <Star className="w-4 h-4 text-zinc-400 shrink-0" />
            <Text variant="label-lg" color="textDark">
              Oblíbené
            </Text>
          </Link>

          {user.type === "company" && (
            <>
              <div className="border-t border-zinc-100 mt-1 pt-1 mb-1">
                <Text variant="caption" color="secondary" className="px-3 py-1">
                  Firma
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
                    Moje firmy
                  </Text>
                </Link>
                <Link
                  href={{ pathname: "/company-profile" }}
                  onClick={() => {
                    setOpen(false);
                    onNavigate?.();
                  }}
                  className="flex items-center gap-2.5 px-3 py-2 hover:bg-zinc-50 transition-colors"
                >
                  <Settings className="w-4 h-4 text-zinc-400 shrink-0" />
                  <Text variant="label-lg" color="textDark">
                    Nastavení firmy
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
                Odhlásit se
              </Text>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
