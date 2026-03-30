"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Link as IntlLink } from "@/app/i18n/navigation";
import { ChevronRight, Home, Signpost, SignpostBig } from "lucide-react";

type BreadcrumbItem = {
  label: string;
  href: string;
};

type Props = {
  items?: BreadcrumbItem[];
};

function formatSegment(segment: string): string {
  return segment.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function Breadcrumbs({ items }: Props) {
  const pathname = usePathname();

  const crumbs: BreadcrumbItem[] =
    items ??
    (() => {
      const segments = pathname.split("/").filter(Boolean);
      return segments.map((segment, index) => ({
        label: formatSegment(segment),
        href: "/" + segments.slice(0, index + 1).join("/"),
      }));
    })();

  if (crumbs.length === 0) return null;

  return (
    <nav aria-label="breadcrumb" className="flex items-center gap-1 mb-6">
      <IntlLink
        href="/company-profile"
        className="flex items-center text-zinc-400 hover:text-zinc-700 transition-colors"
      >
        <Signpost className="w-3.5 h-3.5" />
      </IntlLink>

      {crumbs.map((crumb, index) => {
        const isLast = index === crumbs.length - 1;
        return (
          <span key={crumb.href} className="flex items-center gap-1">
            <ChevronRight className="w-3.5 h-3.5 text-zinc-300 shrink-0" />
            {isLast ? (
              <span className="text-xs font-medium text-zinc-900 truncate max-w-45">
                {crumb.label}
              </span>
            ) : (
              <Link
                href={crumb.href}
                className="text-xs font-medium text-zinc-400 hover:text-zinc-700 transition-colors truncate max-w-45"
              >
                {crumb.label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
