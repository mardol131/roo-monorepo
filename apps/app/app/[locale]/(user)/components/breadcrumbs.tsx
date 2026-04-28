"use client";

import { useParams, usePathname } from "next/navigation";
import { usePathname as useI18nPathname } from "@/app/i18n/navigation";
import { Link as IntlLink } from "@/app/i18n/navigation";
import { ChevronRight, Home, Signpost, SignpostBig } from "lucide-react";
import { useListing } from "@/app/react-query/listings/hooks";
import { useCompany } from "@/app/react-query/companies/hooks";

type BreadcrumbItem = {
  label: string;
  href: string;
};

type Props = {
  items?: BreadcrumbItem[];
};

export default function Breadcrumbs({ items }: Props) {
  const pathname = usePathname();
  const i18nPathname = useI18nPathname();

  const { listingId, companyId, eventId, inquiryId } = useParams();

  const { data: listings } = useListing(
    typeof listingId === "string" ? listingId : "",
  );
  const { data: company } = useCompany(
    typeof companyId === "string" ? companyId : "",
  );
  const { data: events } = useListing(
    typeof eventId === "string" ? eventId : "",
  );
  const { data: inquiries } = useListing(
    typeof inquiryId === "string" ? inquiryId : "",
  );
  function formatSegment(segment: string): string {
    if (companyId && segment === companyId) return company?.name ?? segment;
    if (listingId && segment === listingId) return listings?.name ?? segment;
    if (eventId && segment === eventId) return events?.name ?? segment;
    if (inquiryId && segment === inquiryId) return inquiries?.name ?? segment;

    return segment.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  }

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
      <div className="flex items-center text-zinc-400 transition-colors">
        <Signpost className="w-3.5 h-3.5" />
      </div>

      {crumbs.map((crumb, index) => {
        const isLast = index === crumbs.length - 1;
        return (
          <span key={crumb.href} className="flex items-center gap-1">
            <ChevronRight className="w-3.5 h-3.5 text-textLight shrink-0" />
            {isLast ? (
              <span className="text-xs font-medium text-on-dark truncate max-w-45">
                {crumb.label}
              </span>
            ) : (
              <IntlLink
                href={crumb.href as any}
                className="text-xs font-medium text-textLight hover:text-on-dark transition-colors truncate max-w-45"
              >
                {crumb.label}
              </IntlLink>
            )}
          </span>
        );
      })}
    </nav>
  );
}
