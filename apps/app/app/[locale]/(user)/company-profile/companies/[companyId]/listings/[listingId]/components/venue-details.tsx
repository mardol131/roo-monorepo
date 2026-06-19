"use client";

import { DashboardSection } from "@/app/[locale]/(user)/components/dashboard-section";
import InfoSection from "@/app/[locale]/(user)/components/info-section";
import Text from "@/app/components/ui/atoms/text";
import { useCity } from "@/app/react-query/cities/hooks";
import { useFilterOptions } from "@/app/react-query/filters/aggregated-filters/hooks";
import {
  Activity,
  Amenity,
  EventType,
  getIdFromRelationshipField,
  Listing,
  ListingVenueDetail,
  Necessity,
  Personnel,
  PlaceType,
  Service,
  Technology,
  VenueRule,
} from "@roo/common";

const SPACES_TYPE_LABELS: Record<ListingVenueDetail["spacesType"], string> = {
  area: "Areál",
  building: "Budova",
  room: "Místnosti",
};

const VEHICLE_LABELS: Record<string, string> = {
  car: "Osobní auto",
  truck: "Nákladní auto",
  van: "Dodávka",
  bus: "Autobus",
};

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

export function VenueDetails({
  listing,
  detail,
}: {
  listing: Listing;
  detail: ListingVenueDetail;
}) {
  const { data: filters } = useFilterOptions();

  const placeTypeNames = resolveNames<PlaceType>(
    listing.filters.placeTypes,
    filters?.placeTypes,
  );
  const { data: city } = useCity(
    getIdFromRelationshipField(listing.location?.city) || "",
  );

  const locationItems = [
    ...(city?.name
      ? [
          {
            type: "text" as const,
            label: "Město",
            value: city?.name,
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
    ...(placeTypeNames.length
      ? [
          {
            type: "tagList" as const,
            label: "Typ místa",
            items: placeTypeNames,
          },
        ]
      : []),
  ];

  const filtersItems = [
    ...(detail.filters.eventTypes?.length
      ? [
          {
            type: "tagList" as const,
            label: "Typy akcí",
            items: resolveNames<EventType>(detail.filters.eventTypes),
          },
        ]
      : []),
    ...(detail.filters.venueRules?.length
      ? [
          {
            type: "tagList" as const,
            label: "Pravidla prostoru",
            items: resolveNames<VenueRule>(detail.filters.venueRules),
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
    ...(detail.options.amenities ?? []).map((a) => ({
      name:
        typeof a.amenity === "string" ? a.amenity : (a.amenity as Amenity).name,
      unitPrice: a.unitPrice,
      pricingUnit: a.pricingUnit,
      quantity: a.quantity,
    })),
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
    ...(detail.options.activities ?? []).map((a) => ({
      name:
        typeof a.activity === "string"
          ? a.activity
          : (a.activity as Activity).name,
      unitPrice: a.unitPrice,
      pricingUnit: a.pricingUnit,
      quantity: a.quantity,
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

  const propertyAccessItems = [
    ...(detail.propertyAccess.vehicleTypes?.length
      ? [
          {
            type: "tagList" as const,
            label: "Typy vozidel",
            items: detail.propertyAccess.vehicleTypes.map(
              (v) => VEHICLE_LABELS[v] ?? v,
            ),
          },
        ]
      : []),
    ...(detail.propertyAccess.loadingRamp != null
      ? [
          {
            type: "boolean" as const,
            label: "Nakládková rampa",
            value: detail.propertyAccess.loadingRamp,
          },
        ]
      : []),
    ...(detail.propertyAccess.loadingElevator != null
      ? [
          {
            type: "boolean" as const,
            label: "Nákladní výtah",
            value: detail.propertyAccess.loadingElevator,
          },
        ]
      : []),
    ...(detail.propertyAccess.serviceAccess != null
      ? [
          {
            type: "boolean" as const,
            label: "Servisní vstup",
            value: detail.propertyAccess.serviceAccess,
          },
        ]
      : []),
    ...(detail.propertyAccess.serviceArea != null
      ? [
          {
            type: "boolean" as const,
            label: "Servisní plocha",
            value: detail.propertyAccess.serviceArea,
          },
        ]
      : []),
    ...(detail.parking.hasParking != null
      ? [
          {
            type: "boolean" as const,
            label: "Parkování",
            value: detail.parking.hasParking,
          },
        ]
      : []),
    ...(detail.parking.parkingCapacity
      ? [
          {
            type: "text" as const,
            label: "Kapacita parkoviště",
            value: `${detail.parking.parkingCapacity} míst`,
          },
        ]
      : []),
    ...(detail.parking.parkingIsIncludedInPrice != null
      ? [
          {
            type: "boolean" as const,
            label: "Parkování v ceně",
            value: detail.parking.parkingIsIncludedInPrice,
          },
        ]
      : []),
    ...(detail.parking.parkingPrice
      ? [
          {
            type: "text" as const,
            label: "Cena parkování",
            value: `${detail.parking.parkingPrice} Kč`,
          },
        ]
      : []),
  ];

  const accommodationItems = [
    ...(detail.accomodation.hasAccommodation != null
      ? [
          {
            type: "boolean" as const,
            label: "Ubytování",
            value: detail.accomodation.hasAccommodation,
          },
        ]
      : []),
    ...(detail.accomodation.accommodationCapacity
      ? [
          {
            type: "text" as const,
            label: "Kapacita ubytování",
            value: `${detail.accomodation.accommodationCapacity} lůžek`,
          },
        ]
      : []),
    ...(detail.breakfast.breakfastIncluded != null
      ? [
          {
            type: "boolean" as const,
            label: "Snídaně",
            value: detail.breakfast.breakfastIncluded,
          },
        ]
      : []),
    ...(detail.breakfast.breakfastIsIncludedInPrice != null
      ? [
          {
            type: "boolean" as const,
            label: "Snídaně v ceně",
            value: detail.breakfast.breakfastIsIncludedInPrice,
          },
        ]
      : []),
    ...(detail.breakfast.price
      ? [
          {
            type: "text" as const,
            label: "Cena snídaně",
            value: `${detail.breakfast.price} Kč${detail.breakfast.priceUnit === "person" ? " / osoba" : " / rezervace"}`,
          },
        ]
      : []),
    ...(detail.breakfast.timeFrom && detail.breakfast.timeTo
      ? [
          {
            type: "text" as const,
            label: "Čas snídaně",
            value: `${detail.breakfast.timeFrom} – ${detail.breakfast.timeTo}`,
          },
        ]
      : []),
  ];

  return (
    <>
      <DashboardSection
        title="Lokace"
        icon="MapPin"
        iconBg="bg-blue-50"
        iconColor="text-blue-500"
      >
        <InfoSection items={locationItems} />
      </DashboardSection>

      <DashboardSection
        title="Prostory"
        icon="Building2"
        iconBg="bg-listing-surface"
        iconColor="text-listing"
      >
        <InfoSection
          items={[
            {
              type: "text",
              label: "Typ prostoru",
              value: SPACES_TYPE_LABELS[detail.spacesType],
            },
            { type: "text", label: "Plocha", value: `${detail.area} m²` },
            {
              type: "boolean",
              label: "Rezervace celého prostoru",
              value: detail.canBeBookedAsWhole,
            },
          ]}
        />
      </DashboardSection>

      {filtersItems.length > 0 && (
        <DashboardSection
          title="Podmínky a pravidla"
          icon="Shield"
          iconBg="bg-red-50"
          iconColor="text-red-400"
        >
          <InfoSection items={filtersItems} />
        </DashboardSection>
      )}

      {priceableItems.length > 0 && (
        <DashboardSection
          title="Vybavení a služby"
          icon="Banknote"
          iconBg="bg-green-50"
          iconColor="text-green-500"
        >
          <PriceableList items={priceableItems} />
        </DashboardSection>
      )}

      {propertyAccessItems.length > 0 && (
        <DashboardSection
          title="Přístup a parkování"
          icon="Car"
          iconBg="bg-zinc-50"
          iconColor="text-zinc-500"
        >
          <InfoSection items={propertyAccessItems} />
        </DashboardSection>
      )}

      {accommodationItems.length > 0 && (
        <DashboardSection
          title="Ubytování a snídaně"
          icon="BedDouble"
          iconBg="bg-indigo-50"
          iconColor="text-indigo-500"
        >
          <InfoSection items={accommodationItems} />
        </DashboardSection>
      )}
    </>
  );
}
