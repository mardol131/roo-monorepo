"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import logo from "@/public/logo.png";
import { usePathname } from "next/navigation";
import Button from "../../ui/atoms/button";

const navigationItems = [
  { label: "Místa", href: "#mista" },
  { label: "Gastro", href: "#gastro" },
  { label: "Zábava", href: "#zabava" },
  { label: "Plánovač akcí", href: "#planovac" },
];

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isInUserProfile = pathname.startsWith("/user-profile");

  if (isInUserProfile) return null;

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-zinc-200">
      <div className="max-w-content mx-auto px-8 flex items-center justify-between h-20">
        {/* Logo + nav */}
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <Image src={logo} alt="Roo" width={34} height={34} priority />
            <span className="text-lg font-bold text-zinc-900 tracking-tight">
              Roo
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-0.5">
            {navigationItems.map((item) => (
              <Button
                key={item.href}
                link={item.href}
                version="plain"
                text={item.label}
                size="sm"
              />
            ))}
          </nav>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <Button
            link="/registrations"
            version="plain"
            text="Staňte se dodavatelem"
            size="sm"
          />

          <div className="hidden md:flex items-center gap-2">
            <Button
              link="/login"
              version="plain"
              text="Přihlásit se"
              size="sm"
            />
            <Button
              link="/registrations"
              version="primary"
              text="Registrovat se"
              size="sm"
            />
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((p) => !p)}
            aria-label="Toggle menu"
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-xl text-zinc-700 hover:bg-zinc-100 transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-200 ${
          isMobileMenuOpen ? "max-h-64 border-t border-zinc-100" : "max-h-0"
        }`}
      >
        <nav className="flex flex-col px-4 py-3 gap-1">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 rounded-lg transition-colors"
            >
              {item.label}
            </Link>
          ))}
          <div className="border-t border-zinc-100 mt-2 pt-2 flex flex-col gap-1">
            <Link
              href="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 rounded-lg transition-colors"
            >
              Přihlásit se
            </Link>
            <Link
              href="/register"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2.5 text-sm font-medium text-zinc-900 bg-zinc-100 hover:bg-zinc-200 rounded-lg transition-colors"
            >
              Registrovat
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
