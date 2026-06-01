"use client";

import { DashboardSection } from "@/app/[locale]/(user)/components/dashboard-section";
import InfoSection from "@/app/[locale]/(user)/components/info-section";
import Text from "@/app/components/ui/atoms/text";
import {
  Cuisine,
  DietaryOption,
  DishType,
  EventType,
  FoodPreparationStyle,
  GastroRule,
  Listing,
  ListingGastroDetail,
  Necessity,
  Personnel,
  Service,
} from "@roo/common";

const PRICING_UNIT_LABELS: Record<string, string> = {
  per_day: "za den",
  per_person: "za osobu",
  per_hour: "za hodinu",
  lump_sum: "paušál",
};

function resolveNames<T extends { id: string; name: string }>(
  items: (string | T)[] | null | undefined,
  fetchedDocs?: T[],
): string[] {
  return (items ?? []).map((item) =>
    typeof item === "string"
      ? (fetchedDocs?.find((f) => f.id === item)?.name ?? item)
      : item.name,
  );
}

type PriceableItem = {
  name: string;
  unitPrice: number;
  pricingUnit: string;
  quantity: number;
};

function PriceableList({ items }: { items: PriceableItem[] }) {
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
          <div className="flex items-center gap-3">
            <Text variant="label-sm" color="secondary">
              {item.quantity} ks
            </Text>
            <Text variant="label-sm" color="secondary">
              ·
            </Text>
            <Text variant="label-sm" color="secondary">
              {item.unitPrice} Kč{" "}
              {PRICING_UNIT_LABELS[item.pricingUnit] ?? item.pricingUnit}
            </Text>
          </div>
        </div>
      ))}
    </div>
  );
}

export function GastroDetails({
  listing,
  detail,
}: {
  listing: Listing;
  detail: ListingGastroDetail;
}) {
  const locationItems = [
    ...(listing.location?.city
      ? [{ type: "text" as const, label: "Město", value: listing.location.city }]
      : []),
    ...(listing.location?.address
      ? [{ type: "text" as const, label: "Adresa", value: listing.location.address }]
      : []),
  ];

  const offerItems = [
    {
      type: "boolean" as const,
      label: "Podávání alkoholu",
      value: detail.alcohol.servesAlcohol,
    },
    { type: "boolean" as const, label: "Dětské menu", value: detail.kidsMenu },
    ...(detail.filters.eventTypes?.length
      ? [
          {
            type: "tagList" as const,
            label: "Typy akcí",
            items: resolveNames<EventType>(detail.filters.eventTypes),
          },
        ]
      : []),
    ...(detail.filters.dishTypes?.length
      ? [
          {
            type: "tagList" as const,
            label: "Typy pokrmů",
            items: resolveNames<DishType>(detail.filters.dishTypes),
          },
        ]
      : []),
    ...(detail.filters.dietaryOptions?.length
      ? [
          {
            type: "tagList" as const,
            label: "Dietní možnosti",
            items: resolveNames<DietaryOption>(detail.filters.dietaryOptions),
          },
        ]
      : []),
    ...(detail.filters.gastroRules?.length
      ? [
          {
            type: "tagList" as const,
            label: "Gastro pravidla",
            items: resolveNames<GastroRule>(detail.filters.gastroRules),
          },
        ]
      : []),
    ...(detail.filters.necessities?.length
      ? [
          {
            type: "tagList" as const,
            label: "Technické požadavky",
            items: resolveNames<Necessity>(detail.filters.necessities),
          },
        ]
      : []),
  ];

  const priceableItems: PriceableItem[] = [
    ...(detail.options.cuisines ?? []).map((c) => ({
      name:
        typeof c.cuisine === "string" ? c.cuisine : (c.cuisine as Cuisine).name,
      unitPrice: c.unitPrice,
      pricingUnit: c.pricingUnit,
      quantity: c.quantity,
    })),
    ...(detail.options.foodPreparationStyles ?? []).map((f) => ({
      name:
        typeof f.foodPreparationStyle === "string"
          ? f.foodPreparationStyle
          : (f.foodPreparationStyle as FoodPreparationStyle).name,
      unitPrice: f.unitPrice,
      pricingUnit: f.pricingUnit,
      quantity: f.quantity,
    })),
    ...(detail.options.services ?? []).map((s) => ({
      name:
        typeof s.service === "string" ? s.service : (s.service as Service).name,
      unitPrice: s.unitPrice,
      pricingUnit: s.pricingUnit,
      quantity: s.quantity,
    })),
    ...(detail.options.personnel ?? []).map((p) => ({
      name:
        typeof p.personnel === "string"
          ? p.personnel
          : (p.personnel as Personnel).name,
      unitPrice: p.unitPrice,
      pricingUnit: p.pricingUnit,
      quantity: p.quantity,
    })),
  ];

  return (
    <>
      {locationItems.length > 0 && (
        <DashboardSection
          title="Lokace"
          icon="MapPin"
          iconBg="bg-blue-50"
          iconColor="text-blue-500"
        >
          <InfoSection items={locationItems} />
        </DashboardSection>
      )}

      <DashboardSection
        title="Nabídka"
        icon="Utensils"
        iconBg="bg-orange-50"
        iconColor="text-orange-500"
      >
        <InfoSection items={offerItems} />
      </DashboardSection>

      {priceableItems.length > 0 && (
        <DashboardSection
          title="Kuchyně a služby"
          icon="Banknote"
          iconBg="bg-green-50"
          iconColor="text-green-500"
        >
          <PriceableList items={priceableItems} />
        </DashboardSection>
      )}
    </>
  );
}
