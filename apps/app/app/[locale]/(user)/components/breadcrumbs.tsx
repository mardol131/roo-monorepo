"use client";

import { useParams, usePathname } from "next/navigation";
import { usePathname as useI18nPathname } from "@/app/i18n/navigation";
import { Link as IntlLink } from "@/app/i18n/navigation";
import { ChevronRight, Home, Signpost, SignpostBig } from "lucide-react";
import { useListing } from "@/app/react-query/listings/hooks";
import { useCompany } from "@/app/react-query/companies/hooks";
import { useVariant } from "@/app/react-query/variants/hooks";
import { useTranslations } from "next-intl";
import { useSpace } from "@/app/react-query/spaces/hooks";

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
  const t = useTranslations();

  const { listingId, companyId, eventId, inquiryId, variantId, spaceId } =
    useParams();

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
  const { data: variant } = useVariant(
    typeof variantId === "string" ? variantId : "",
  );

  const { data: space } = useSpace(typeof spaceId === "string" ? spaceId : "");
  function formatSegment(segment: string): string {
    if (companyId && segment === companyId) return company?.name ?? segment;
    if (listingId && segment === listingId) return listings?.name ?? segment;
    if (eventId && segment === eventId) return events?.name ?? segment;
    if (inquiryId && segment === inquiryId) return inquiries?.name ?? segment;
    if (variantId && segment === variantId) return variant?.name ?? segment;
    if (spaceId && segment === spaceId) return space?.name ?? segment;

    if (segment === "company-profile") return t("companies.singular");
    if (segment === "companies") return t("companies.plural");
    if (segment === "listings") return t("listings.plural");
    if (segment === "events") return t("events.plural");
    if (segment === "inquiries") return t("inquiries.plural");
    if (segment === "variants") return t("variants.plural");
    if (segment === "spaces") return t("spaces.plural");
    if (segment === "edit") return t("breadcrumbs.edit");

    if (segment === "[companyId]")
      return company?.name ?? t("companies.singular");
    if (segment === "[listingId]")
      return listings?.name ?? t("listings.singular");
    if (segment === "[eventId]") return events?.name ?? t("events.singular");
    if (segment === "[inquiryId]")
      return inquiries?.name ?? t("inquiries.singular");
    if (segment === "[variantId]")
      return variant?.name ?? t("variants.singular");
    if (segment === "[spaceId]") return space?.name ?? t("spaces.singular");

    return segment.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  }

  const crumbs: BreadcrumbItem[] =
    items ??
    (() => {
      const i18nSegments = i18nPathname.split("/").filter(Boolean);
      const segments = pathname.split("/").filter(Boolean);
      return segments.map((segment, index) => ({
        label: formatSegment(i18nSegments[index]),
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
