"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import logo from "@/public/logo.png";
import Text from "../../ui/atoms/text";

type HeaderProps = {};

type NavigationItem = {
  label: string;
  href: string;
};

const navigationItems: NavigationItem[] = [
  { label: "Místo", href: "#produkty" },
  { label: "Gastro", href: "#reseni" },
  { label: "Zábava", href: "#cenik" },
  { label: "Plánovač akcí", href: "#kontakt" },
];

export default function Header({}: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="fixed left-0 top-0 z-50 w-full flex justify-center items-center border-b border-zinc-100/80 bg-linear-0 to-white/90 from-zinc-100/90 backdrop-blur-md shadow-sm">
      <div className=" flex max-w-content w-full items-center justify-between py-6">
        {/* Logo a menu */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3">
            <Image src={logo} alt="Roo" width={36} height={36} priority />
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-medium text-zinc-700 md:flex">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="hover:text-zinc-900 transition-colors"
              >
                <Text variant="body3">{item.label}</Text>
              </Link>
            ))}
          </nav>
        </div>

        {/* Textový link a toggle menu */}
        <div className="flex items-center gap-4">
          <Link
            href="/demo"
            className="text-sm font-medium text-rose-500 hover:text-rose-600 transition-colors"
          >
            <Text variant="body3" color="primary">
              Staňte se dodavatelem
            </Text>
          </Link>
          <button
            type="button"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
            className="flex h-10 w-10 items-center bg-zinc-100 justify-center rounded-full cursor-pointer border-zinc-200 text-zinc-900 transition-colors hover:bg-primary/10"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5 stroke-3 stroke-zinc-700" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden ${
          isMobileMenuOpen ? "max-h-96 border-t border-zinc-100" : "max-h-0"
        } overflow-hidden bg-white transition-[max-height] duration-300 ease-out`}
      >
        <nav className="flex flex-col gap-4 text-sm font-medium text-zinc-800">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={closeMobileMenu}
              className="hover:text-zinc-900 transition-colors"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/demo"
            onClick={closeMobileMenu}
            className="text-rose-500 hover:text-rose-600 transition-colors"
          >
            Domluvit demo
          </Link>
        </nav>
      </div>
    </header>
  );
}
