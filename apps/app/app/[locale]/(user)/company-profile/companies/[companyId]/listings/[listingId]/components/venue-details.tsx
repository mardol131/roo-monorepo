"use client";

import { DashboardSection } from "@/app/[locale]/(user)/components/dashboard-section";
import InfoSection from "@/app/[locale]/(user)/components/info-section";
import { useCities } from "@/app/react-query/cities/hooks";
import { useDistricts } from "@/app/react-query/districts/hooks";
import { useFilterOptions } from "@/app/react-query/filters/aggregated-filters/hooks";
import { useRegions } from "@/app/react-query/regions/hooks";
import {
  City,
  District,
  Listing,
  ListingVenueDetail,
  PlaceType,
  Region,
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

function extractIds(
  items: (string | { id: string })[] | null | undefined,
): string[] {
  return (items ?? []).filter(
    (item): item is string => typeof item === "string",
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

export function VenueDetails({
  listing,
  detail,
}: {
  listing: Listing;
  detail: ListingVenueDetail;
}) {
  const location = listing.location;

  const regionIds = extractIds(location?.regions);
  const districtIds = extractIds(location?.districts);
  const cityIds = extractIds(location?.cities);
  const placeTypeIds = listing.filters.placeTypes;

  const { data: regionsData } = useRegions(
    regionIds.length ? { id: { in: regionIds } } : undefined,
    regionIds.length || 10,
    regionIds.length > 0,
  );
  const { data: districtsData } = useDistricts(
    districtIds.length ? { id: { in: districtIds } } : undefined,
    districtIds.length || 10,
    districtIds.length > 0,
  );
  const { data: citiesData } = useCities({
    query: cityIds.length ? { id: { in: cityIds } } : undefined,
    limit: cityIds.length || 10,
    enabled: cityIds.length > 0,
  });
  const { data: filters } = useFilterOptions();

  const regionNames = resolveNames<Region>(
    location?.regions,
    regionsData?.docs,
  );
  const districtNames = resolveNames<District>(
    location?.districts,
    districtsData?.docs,
  );
  const cityNames = resolveNames<City>(location?.cities, citiesData?.docs);
  const placeTypeNames = resolveNames<PlaceType>(
    placeTypeIds,
    filters?.placeTypes,
  );

  const exactCityName =
    location?.type === "exact" && location.city
      ? typeof location.city === "string"
        ? (citiesData?.docs?.find((c) => c.id === location.city)?.name ??
          location.city)
        : location.city.name
      : null;

  const locationItems = [
    ...(regionNames.length
      ? [{ type: "tagList" as const, label: "Kraj", items: regionNames }]
      : []),
    ...(districtNames.length
      ? [{ type: "tagList" as const, label: "Okres", items: districtNames }]
      : []),
    ...(cityNames.length
      ? [{ type: "tagList" as const, label: "Město", items: cityNames }]
      : []),
    ...(exactCityName
      ? [{ type: "text" as const, label: "Město", value: exactCityName }]
      : []),
    ...(location?.address
      ? [{ type: "text" as const, label: "Adresa", value: location.address }]
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

  const equipmentItems = [
    ...(listing.options.amenities?.length
      ? [
          {
            type: "tagList" as const,
            label: "Vybavení",
            items: listing.options.amenities,
          },
        ]
      : []),
    ...(listing.options.technologies?.length
      ? [
          {
            type: "tagList" as const,
            label: "Technika",
            items: listing.options.technologies,
          },
        ]
      : []),
    ...(listing.options.services?.length
      ? [
          {
            type: "tagList" as const,
            label: "Služby",
            items: listing.options.services,
          },
        ]
      : []),
    ...(listing.options.activities?.length
      ? [
          {
            type: "tagList" as const,
            label: "Aktivity",
            items: listing.options.activities,
          },
        ]
      : []),
    ...(listing.options.personnel?.length
      ? [
          {
            type: "tagList" as const,
            label: "Personál",
            items: listing.options.personnel,
          },
        ]
      : []),
  ];

  const accessParkingItems = [
    ...(detail.access?.vehicleTypes?.length
      ? [
          {
            type: "tagList" as const,
            label: "Typy vozidel",
            items: detail.access.vehicleTypes.map(
              (v) => VEHICLE_LABELS[v] ?? v,
            ),
          },
        ]
      : []),
    ...(detail.access?.helpWithLoadingAndUnloading != null
      ? [
          {
            type: "boolean" as const,
            label: "Pomoc s nakládkou",
            value: detail.access.helpWithLoadingAndUnloading,
          },
        ]
      : []),
    ...(detail.access?.loadingRamp != null
      ? [
          {
            type: "boolean" as const,
            label: "Nakládková rampa",
            value: detail.access.loadingRamp,
          },
        ]
      : []),
    ...(detail.access?.loadingElevator != null
      ? [
          {
            type: "boolean" as const,
            label: "Nákladní výtah",
            value: detail.access.loadingElevator,
          },
        ]
      : []),
    ...(detail.access?.serviceAccess != null
      ? [
          {
            type: "boolean" as const,
            label: "Servisní vstup",
            value: detail.access.serviceAccess,
          },
        ]
      : []),
    ...(detail.access?.serviceArea != null
      ? [
          {
            type: "boolean" as const,
            label: "Servisní plocha",
            value: detail.access.serviceArea,
          },
        ]
      : []),
    ...(detail.parking?.hasParking != null
      ? [
          {
            type: "boolean" as const,
            label: "Parkování",
            value: detail.parking.hasParking,
          },
        ]
      : []),
    ...(detail.parking?.parkingCapacity
      ? [
          {
            type: "text" as const,
            label: "Kapacita parkoviště",
            value: `${detail.parking.parkingCapacity} míst`,
          },
        ]
      : []),
    ...(detail.parking?.parkingIsIncludedInPrice != null
      ? [
          {
            type: "boolean" as const,
            label: "Parkování v ceně",
            value: detail.parking.parkingIsIncludedInPrice,
          },
        ]
      : []),
    ...(detail.parking?.parkingPrice
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
    ...(detail.hasAccommodation != null
      ? [
          {
            type: "boolean" as const,
            label: "Ubytování",
            value: detail.hasAccommodation,
          },
        ]
      : []),
    ...(detail.accommodationCapacity
      ? [
          {
            type: "text" as const,
            label: "Kapacita ubytování",
            value: `${detail.accommodationCapacity} lůžek`,
          },
        ]
      : []),
    ...(detail.breakfast?.included != null
      ? [
          {
            type: "boolean" as const,
            label: "Snídaně",
            value: detail.breakfast.included,
          },
        ]
      : []),
    ...(detail.breakfast?.breakfastIsIncludedInPrice != null
      ? [
          {
            type: "boolean" as const,
            label: "Snídaně v ceně",
            value: detail.breakfast.breakfastIsIncludedInPrice,
          },
        ]
      : []),
    ...(detail.breakfast?.price
      ? [
          {
            type: "text" as const,
            label: "Cena snídaně",
            value: `${detail.breakfast.price} Kč${detail.breakfast.pricePer === "person" ? " / osoba" : " / rezervace"}`,
          },
        ]
      : []),
    ...(detail.breakfast?.timeFrom && detail.breakfast?.timeTo
      ? [
          {
            type: "text" as const,
            label: "Čas snídaně",
            value: `${detail.breakfast.timeFrom} – ${detail.breakfast.timeTo}`,
          },
        ]
      : []),
  ];

  const rulesItems = [
    ...(listing.filters.venueRules?.length
      ? [
          {
            type: "tagList" as const,
            label: "Pravidla prostoru",
            items: listing.filters.venueRules,
          },
        ]
      : []),
    ...(listing.filters.gastroRules?.length
      ? [
          {
            type: "tagList" as const,
            label: "Pravidla pro jídlo a pití",
            items: listing.filters.gastroRules,
          },
        ]
      : []),
  ];

  return (
    <>
      <DashboardSection
        title="Lokace"
        icon={"MapPin"}
        iconBg="bg-blue-50"
        iconColor="text-blue-500"
      >
        <InfoSection items={locationItems} />
      </DashboardSection>

      <DashboardSection
        title="Prostory"
        icon={"Building2"}
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

      {equipmentItems.length > 0 && (
        <DashboardSection
          title="Vybavení a personál"
          icon={"Wifi"}
          iconBg="bg-purple-50"
          iconColor="text-purple-500"
        >
          <InfoSection items={equipmentItems} />
        </DashboardSection>
      )}

      {accessParkingItems.length > 0 && (
        <DashboardSection
          title="Přístup a parkování"
          icon={"Car"}
          iconBg="bg-zinc-50"
          iconColor="text-zinc-500"
        >
          <InfoSection items={accessParkingItems} />
        </DashboardSection>
      )}

      {accommodationItems.length > 0 && (
        <DashboardSection
          title="Ubytování a snídaně"
          icon={"BedDouble"}
          iconBg="bg-indigo-50"
          iconColor="text-indigo-500"
        >
          <InfoSection items={accommodationItems} />
        </DashboardSection>
      )}

      {rulesItems.length > 0 && (
        <DashboardSection
          title="Pravidla"
          icon={"Shield"}
          iconBg="bg-red-50"
          iconColor="text-red-400"
        >
          <InfoSection items={rulesItems} />
        </DashboardSection>
      )}
    </>
  );
}
