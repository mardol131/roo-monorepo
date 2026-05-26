"use client";

import { useAuth } from "@/app/context/auth/auth-context";
import { IntlLink, Link } from "@/app/i18n/navigation";
import logo from "@/public/logo.png";
import { Balloon, MapPin, Menu, UtensilsCrossed, X } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";
import Text from "../../ui/atoms/text";
import HeaderAuthWidget from "./header-auth-widget";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const auth = useAuth();
  const t = useTranslations("global.header");

  const NAV_ITEMS: {
    label: string;
    href: IntlLink;
    icon: React.ElementType;
  }[] = [
    {
      label: t("nav.venue"),
      icon: MapPin,
      href: { pathname: "/catalog/venue" },
    },
    {
      label: t("nav.gastro"),
      icon: UtensilsCrossed,
      href: { pathname: "/catalog/gastro" },
    },
    {
      label: t("nav.entertainment"),
      icon: Balloon,
      href: { pathname: "/catalog/entertainment" },
    },
  ];

  const userIsNotLoggedInOrDoesNotHaveCompany =
    !auth.user || !auth.user.roles.includes("company");
  return (
    <header className="sticky top-0 z-50 px-6 w-full bg-white/95 backdrop-blur-sm border-b border-zinc-100">
      <div className="max-w-content mx-auto flex items-center justify-between h-16">
        {/* Logo + nav */}
        <div className="flex items-center gap-8">
          <Link href="/homepage" className="flex items-center gap-2 shrink-0">
            <Image src={logo} alt="Roo" width={28} height={28} priority />
            <span className="text-base font-bold text-zinc-900 tracking-tight">
              roo
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-0.5">
            {NAV_ITEMS.map(({ label, href, icon: Icon }) => (
              <Link
                key={label}
                href={href}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold text-zinc-900 hover:bg-zinc-100 transition-colors"
              >
                <Icon className="w-4 h-4 shrink-0 text-zinc-400" />
                {label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Supplier CTA */}
          {userIsNotLoggedInOrDoesNotHaveCompany && (
            <>
              <Link
                href="/register-company"
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 transition-colors"
              >
                <Text variant="label-lg">{t("supplierCta")}</Text>
              </Link>
              <div className="hidden md:block w-px h-4 bg-zinc-200 mx-1" />
            </>
          )}

          {/* Auth */}
          <div className="hidden md:flex items-center gap-1.5">
            <HeaderAuthWidget />
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            onClick={() => setMobileOpen((p) => !p)}
            aria-label="Toggle menu"
            className="md:hidden flex items-center justify-center w-8 h-8 rounded-lg text-zinc-600 hover:bg-zinc-100 transition-colors"
          >
            {mobileOpen ? (
              <X className="w-4 h-4" />
            ) : (
              <Menu className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-200 ${
          mobileOpen ? "max-h-80 border-t border-zinc-100" : "max-h-0"
        }`}
      >
        <nav className="flex flex-col px-4 py-3 gap-0.5">
          {NAV_ITEMS.map(({ label, href, icon: Icon }) => (
            <Link
              key={label}
              href={href}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 px-3 py-2.5 text-sm font-semibold text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors"
            >
              <Icon className="w-4 h-4 shrink-0 text-zinc-400" />
              {label}
            </Link>
          ))}
          <Link
            href="/register-company"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 rounded-lg transition-colors"
          >
            {t("supplierCta")}
          </Link>

          <div className="border-t border-zinc-100 mt-1.5 pt-1.5 flex flex-col gap-0.5">
            <HeaderAuthWidget onNavigate={() => setMobileOpen(false)} />
          </div>
        </nav>
      </div>
    </header>
  );
}
