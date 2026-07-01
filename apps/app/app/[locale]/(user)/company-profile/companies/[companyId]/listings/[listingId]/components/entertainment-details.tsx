"use client";

import { DashboardSection } from "@/app/[locale]/(user)/components/dashboard-section";
import InfoSection from "@/app/[locale]/(user)/components/info-section";
import Text from "@/app/components/ui/atoms/text";
import {
  EntertainmentRule,
  EventType,
  Listing,
  ListingEntertainmentDetail,
  MusicGenre,
  Necessity,
  PricingUnits,
  Service,
  Technology,
} from "@roo/common";
import { useTranslations } from "next-intl";

const AUDIENCE_LABELS: Record<string, string> = {
  adults: "Dospělí",
  kids: "Děti",
  seniors: "Senioři",
};

type PriceableItem = {
  name: string;
  unitPrice: number;
  pricingUnit: PricingUnits;
  quantity: number;
};

function PriceableList({ items }: { items: PriceableItem[] }) {
  const t = useTranslations("global.pricing.units");

  return (
    <div className="flex flex-col gap-2">
      {items.map((item, i) => (
        <div
          key={i}
          className="flex items-center justify-between rounded-lg border border-zinc-100 bg-zinc-50 px-4 py-3"
        >
          <Text variant="label-sm" color="textDark" className="font-medium">
            {item.name}
          </Text>
          <div className="flex items-center gap-3 text-sm text-zinc-500">
            <Text variant="label-sm" color="secondary">
              {item.quantity} ks
            </Text>
            <Text variant="label-sm" color="secondary">
              ·
            </Text>
            <Text variant="label-sm" color="secondary">
              {item.unitPrice} Kč {t(item.pricingUnit)}
            </Text>
          </div>
        </div>
      ))}
    </div>
  );
}

function resolveNames<T extends { id: string; name: string }>(
  items: (string | T)[] | null | undefined,
  fetchedDocs: T[] | undefined,
): string[] {
  return (items ?? []).map((item) =>
    typeof item === "string"
      ? (fetchedDocs?.find((f) => f.id === item)?.name ?? item)
      : item.name,
  );
}

export function EntertainmentDetails({
  listing,
  detail,
}: {
  listing: Listing;
  detail: ListingEntertainmentDetail;
}) {
  const servicableArea = listing.servicableArea;

  const locationItems = [
    ...(servicableArea?.wholeCountry
      ? [{ type: "text" as const, label: "Působiště", value: "Celá ČR" }]
      : servicableArea?.maxTravelDistanceKm
        ? [
            {
              type: "text" as const,
              label: "Působiště",
              value: `Do ${servicableArea.maxTravelDistanceKm} km od adresy`,
            },
          ]
        : []),
    ...(listing.location?.address
      ? [
          {
            type: "text" as const,
            label: "Adresa",
            value: listing.location.address,
          },
        ]
      : []),
  ];

  const programItems = [
    ...(detail.audience?.length
      ? [
          {
            type: "tagList" as const,
            label: "Cílové publikum",
            items: detail.audience.map((a) => AUDIENCE_LABELS[a] ?? a),
          },
        ]
      : []),
    ...(detail.filters.eventTypes?.length
      ? [
          {
            type: "tagList" as const,
            label: "Typy akcí",
            items: resolveNames<EventType>(detail.filters.eventTypes, []),
          },
        ]
      : []),
    ...(detail.filters.musicGenres?.length
      ? [
          {
            type: "tagList" as const,
            label: "Hudební žánry",
            items: resolveNames<MusicGenre>(detail.filters.musicGenres, []),
          },
        ]
      : []),
    ...(detail.filters.entertainmentRules?.length
      ? [
          {
            type: "tagList" as const,
            label: "Pravidla",
            items: resolveNames<EntertainmentRule>(
              detail.filters.entertainmentRules,
              [],
            ),
          },
        ]
      : []),
    ...(detail.filters.necessities?.length
      ? [
          {
            type: "tagList" as const,
            label: "Technické požadavky",
            items: resolveNames<Necessity>(detail.filters.necessities, []),
          },
        ]
      : []),
  ];

  const logisticsItems = [
    ...(detail.setupAndTearDown.setupTime != null
      ? [
          {
            type: "text" as const,
            label: "Čas přípravy",
            value: `${detail.setupAndTearDown.setupTime} min`,
          },
        ]
      : []),
    ...(detail.setupAndTearDown.tearDownTime != null
      ? [
          {
            type: "text" as const,
            label: "Čas úklidu",
            value: `${detail.setupAndTearDown.tearDownTime} min`,
          },
        ]
      : []),
  ];

  const priceableItems: PriceableItem[] = [
    ...(detail.options.technologies ?? []).map((t) => ({
      name:
        typeof t.technology === "string"
          ? t.technology
          : (t.technology as Technology).name,
      unitPrice: t.unitPrice,
      pricingUnit: t.pricingUnit,
      quantity: t.quantity,
    })),
    ...(detail.options.services ?? []).map((s) => ({
      name:
        typeof s.service === "string" ? s.service : (s.service as Service).name,
      unitPrice: s.unitPrice,
      pricingUnit: s.pricingUnit,
      quantity: s.quantity,
    })),
  ];

  const personnelItems = [
    ...(listing.options.personnel?.length
      ? [
          {
            type: "tagList" as const,
            label: "Personál",
            items: listing.options.personnel,
          },
        ]
      : []),
    ...(listing.options.technologies?.length
      ? [
          {
            type: "tagList" as const,
            label: "Technologie",
            items: listing.options.technologies,
          },
        ]
      : []),
  ];

  return (
    <>
      {locationItems.length > 0 && (
        <DashboardSection
          title="Místo působení"
          icon="MapPin"
          iconBg="bg-blue-50"
          iconColor="text-blue-500"
        >
          <InfoSection items={locationItems} />
        </DashboardSection>
      )}

      {programItems.length > 0 && (
        <DashboardSection
          title="Typ programu"
          icon="Music"
          iconBg="bg-purple-50"
          iconColor="text-purple-500"
        >
          <InfoSection items={programItems} />
        </DashboardSection>
      )}

      {logisticsItems.length > 0 && (
        <DashboardSection
          title="Logistika"
          icon="Clock"
          iconBg="bg-amber-50"
          iconColor="text-amber-500"
        >
          <InfoSection items={logisticsItems} />
        </DashboardSection>
      )}

      {priceableItems.length > 0 && (
        <DashboardSection
          title="Technologie a služby"
          icon="Banknote"
          iconBg="bg-green-50"
          iconColor="text-green-500"
        >
          <PriceableList items={priceableItems} />
        </DashboardSection>
      )}

      {personnelItems.length > 0 && (
        <DashboardSection
          title="Personál a vybavení"
          icon="Users"
          iconBg="bg-zinc-50"
          iconColor="text-zinc-500"
        >
          <InfoSection items={personnelItems} />
        </DashboardSection>
      )}
    </>
  );
}
