"use client";

import { DashboardSection } from "@/app/[locale]/(user)/components/dashboard-section";
import InfoSection from "@/app/[locale]/(user)/components/info-section";
import { useCities } from "@/app/react-query/cities/hooks";
import { useDistricts } from "@/app/react-query/districts/hooks";
import { useRegions } from "@/app/react-query/regions/hooks";
import {
  City,
  District,
  Listing,
  ListingGastroDetail,
  Region,
} from "@roo/common";

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

export function GastroDetails({
  listing,
  detail,
}: {
  listing: Listing;
  detail: ListingGastroDetail;
}) {
  const location = listing.location;

  const regionIds = extractIds(location?.regions);
  const districtIds = extractIds(location?.districts);
  const cityIds = extractIds(location?.cities);

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

  const regionNames = resolveNames<Region>(
    location?.regions,
    regionsData?.docs,
  );
  const districtNames = resolveNames<District>(
    location?.districts,
    districtsData?.docs,
  );
  const cityNames = resolveNames<City>(location?.cities, citiesData?.docs);

  const exactCityName =
    location?.type === "exact" && location.city
      ? typeof location.city === "string"
        ? (citiesData?.docs?.find((c) => c.id === location.city)?.name ??
          location.city)
        : location.city.name
      : null;

  const locationItems = location
    ? [
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
        ...(location.address
          ? [
              {
                type: "text" as const,
                label: "Adresa",
                value: location.address,
              },
            ]
          : []),
      ]
    : [];

  const offerItems = [
    ...(listing.properties.cuisines?.length
      ? [
          {
            type: "tagList" as const,
            label: "Kuchyně",
            items: listing.properties.cuisines,
          },
        ]
      : []),
    ...(listing.properties.dishTypes?.length
      ? [
          {
            type: "tagList" as const,
            label: "Typy pokrmů",
            items: listing.properties.dishTypes,
          },
        ]
      : []),
    ...(listing.properties.dietaryOptions?.length
      ? [
          {
            type: "tagList" as const,
            label: "Dietní možnosti",
            items: listing.properties.dietaryOptions,
          },
        ]
      : []),
    ...(listing.properties.foodServiceStyles?.length
      ? [
          {
            type: "tagList" as const,
            label: "Styl servisu",
            items: listing.properties.foodServiceStyles,
          },
        ]
      : []),
    {
      type: "boolean" as const,
      label: "Alkoholová licence",
      value: detail.hasAlcoholLicense,
    },
    { type: "boolean" as const, label: "Dětské menu", value: detail.kidsMenu },
  ];

  const personnelItems = [
    ...(listing.properties.personnel?.length
      ? [
          {
            type: "tagList" as const,
            label: "Personál",
            items: listing.properties.personnel,
          },
        ]
      : []),
    ...(listing.properties.necessities?.length
      ? [
          {
            type: "tagList" as const,
            label: "Technické požadavky",
            items: listing.properties.necessities,
          },
        ]
      : []),
  ];

  return (
    <>
      {locationItems.length > 0 && (
        <DashboardSection
          title="Místo působení"
          icon={"MapPin"}
          iconBg="bg-blue-50"
          iconColor="text-blue-500"
        >
          <InfoSection items={locationItems} />
        </DashboardSection>
      )}

      <DashboardSection
        title="Nabídka"
        icon={"Utensils"}
        iconBg="bg-orange-50"
        iconColor="text-orange-500"
      >
        <InfoSection items={offerItems} />
      </DashboardSection>

      {personnelItems.length > 0 && (
        <DashboardSection
          title="Personál a požadavky"
          icon={"Users"}
          iconBg="bg-zinc-50"
          iconColor="text-zinc-500"
        >
          <InfoSection items={personnelItems} />
        </DashboardSection>
      )}
    </>
  );
}
