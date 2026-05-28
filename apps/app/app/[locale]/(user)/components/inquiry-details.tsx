"use client";

import { DashboardSection } from "@/app/[locale]/(user)/components/dashboard-section";
import Text from "@/app/components/ui/atoms/text";
import type { Listing } from "@roo/common";
import type { Inquiry } from "@roo/common";
import Link from "next/link";
import { useTranslations } from "next-intl";

type Props = {
  inquiry: Inquiry;
  listing?: Listing;
};

const PRICING_MODE_LABELS: Record<Inquiry["pricing"]["mode"], string> = {
  fixed: "Pevná cena",
  open: "Otevřená cena",
};

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-sm text-zinc-500 w-40 shrink-0 pt-px">{label}</span>
      <span className="text-sm font-medium text-zinc-900">{value}</span>
    </div>
  );
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleString("cs-CZ", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function InquiryDetails({ inquiry, listing }: Props) {
  const t = useTranslations();
  const event = typeof inquiry.event === "object" ? inquiry.event : null;

  return (
    <DashboardSection
      title="Detail poptávky"
      icon={"FileText"}
      iconBg="bg-zinc-100"
      iconColor="text-zinc-500"
    >
      <div className="flex flex-col gap-3">
        <Row
          label="Inzerát"
          value={
            listing ? (
              <Link
                href={`/listing/${listing.id}`}
                className="text-sm font-medium text-zinc-900 underline underline-offset-2 hover:text-zinc-600"
              >
                {listing.name}
              </Link>
            ) : (
              <Text variant="body-sm" color="textDark">
                N/A
              </Text>
            )
          }
        />
        <Row
          label="Typ inzerátu"
          value={t(`global.listings.type.${inquiry.listingType}`)}
        />
        <Row
          label="Typ poptávky"
          value={inquiry.variant ? "Varianta" : "Vlastní poptávka"}
        />
        {event && (
          <Row
            label="Datum události"
            value={`${formatDate(event.date.start)} – ${formatDate(event.date.end)}`}
          />
        )}
        <Row
          label="Režim ceny"
          value={PRICING_MODE_LABELS[inquiry.pricing.mode]}
        />
        {inquiry.pricing.quotedPrice != null && (
          <Row
            label="Nabídnutá cena"
            value={
              <Text variant="body-sm" color="textDark">
                {inquiry.pricing.quotedPrice} Kč
              </Text>
            }
          />
        )}
        {inquiry.pricing.agreedPrice != null && (
          <Row
            label="Dohodnutá cena"
            value={
              <Text variant="body-sm" color="textDark">
                {inquiry.pricing.agreedPrice} Kč
              </Text>
            }
          />
        )}
        {inquiry.request?.note && (
          <Row
            label="Zpráva od zákazníka"
            value={
              <Text variant="body-sm" color="textDark">
                {inquiry.request.note}
              </Text>
            }
          />
        )}
        {(inquiry.request?.requirements ?? []).length > 0 && (
          <Row
            label="Požadavky"
            value={
              <ul className="flex flex-col gap-1">
                {inquiry.request.requirements!.map((req, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 shrink-0" />
                    <Text variant="body-sm" color="textDark">
                      {req.text}
                    </Text>
                  </li>
                ))}
              </ul>
            }
          />
        )}
      </div>
    </DashboardSection>
  );
}
