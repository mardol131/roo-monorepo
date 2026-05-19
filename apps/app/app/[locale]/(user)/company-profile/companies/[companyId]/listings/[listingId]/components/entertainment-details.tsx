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
  ListingEntertainmentDetail,
  Region,
} from "@roo/common";

const AUDIENCE_LABELS: Record<string, string> = {
  adults: "Dospělí",
  kids: "Děti",
  seniors: "Senioři",
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

export function EntertainmentDetails({
  listing,
  detail,
}: {
  listing: Listing;
  detail: ListingEntertainmentDetail;
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

  const programItems = [
    ...(listing.properties.entertainmentTypes?.length
      ? [
          {
            type: "tagList" as const,
            label: "Typy programu",
            items: listing.properties.entertainmentTypes,
          },
        ]
      : []),
    ...(detail.audience?.length
      ? [
          {
            type: "tagList" as const,
            label: "Cílové publikum",
            items: detail.audience.map((a) => AUDIENCE_LABELS[a] ?? a),
          },
        ]
      : []),
  ];

  const logisticsItems = detail.setupAndTearDownRules
    ? [
        ...(detail.setupAndTearDownRules.setupTime != null
          ? [
              {
                type: "text" as const,
                label: "Čas přípravy",
                value: `${detail.setupAndTearDownRules.setupTime} min`,
              },
            ]
          : []),
        ...(detail.setupAndTearDownRules.tearDownTime != null
          ? [
              {
                type: "text" as const,
                label: "Čas úklidu",
                value: `${detail.setupAndTearDownRules.tearDownTime} min`,
              },
            ]
          : []),
      ]
    : [];

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

      {programItems.length > 0 && (
        <DashboardSection
          title="Typ programu"
          icon={"Music"}
          iconBg="bg-purple-50"
          iconColor="text-purple-500"
        >
          <InfoSection items={programItems} />
        </DashboardSection>
      )}

      {logisticsItems.length > 0 && (
        <DashboardSection
          title="Logistika"
          icon={"Clock"}
          iconBg="bg-amber-50"
          iconColor="text-amber-500"
        >
          <InfoSection items={logisticsItems} />
        </DashboardSection>
      )}

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
