import { DashboardSection } from "@/app/[locale]/(user)/components/dashboard-section";
import InfoSection from "@/app/[locale]/(user)/components/info-section";
import { Listing } from "@roo/common";
import { Clock, MapPin, Music, Users } from "lucide-react";

type EntertainmentBlock = Extract<
  Listing["details"][number],
  { blockType: "entertainment" }
>;

const AUDIENCE_LABELS: Record<string, string> = {
  adults: "Dospělí",
  kids: "Děti",
  seniors: "Senioři",
};

export function EntertainmentDetails({ block }: { block: EntertainmentBlock }) {
  const locationItems = block.location
    ? [
        ...(block.location.region?.length
          ? [
              {
                type: "tagList" as const,
                label: "Kraj",
                items: block.location.region,
              },
            ]
          : []),
        ...(block.location.district?.length
          ? [
              {
                type: "tagList" as const,
                label: "Okres",
                items: block.location.district,
              },
            ]
          : []),
        ...(block.location.city?.length
          ? [
              {
                type: "tagList" as const,
                label: "Město",
                items: block.location.city,
              },
            ]
          : []),
        ...(block.location.address
          ? [
              {
                type: "text" as const,
                label: "Adresa",
                value: block.location.address,
              },
            ]
          : []),
      ]
    : [];

  const capacityItems = [
    {
      type: "text" as const,
      label: "Maximální kapacita",
      value: `${block.capacity} osob`,
    },
    ...(block.minimumCapacity
      ? [
          {
            type: "text" as const,
            label: "Minimální kapacita",
            value: `${block.minimumCapacity} osob`,
          },
        ]
      : []),
  ];

  const programItems = [
    ...(block.entertainmentTypes?.length
      ? [
          {
            type: "tagList" as const,
            label: "Typy programu",
            items: block.entertainmentTypes,
          },
        ]
      : []),
    ...(block.audience?.length
      ? [
          {
            type: "tagList" as const,
            label: "Cílové publikum",
            items: block.audience.map((a) => AUDIENCE_LABELS[a] ?? a),
          },
        ]
      : []),
  ];

  const logisticsItems = block.setupAndTearDownRules
    ? [
        ...(block.setupAndTearDownRules.setupTime != null
          ? [
              {
                type: "text" as const,
                label: "Čas přípravy",
                value: `${block.setupAndTearDownRules.setupTime} min`,
              },
            ]
          : []),
        ...(block.setupAndTearDownRules.tearDownTime != null
          ? [
              {
                type: "text" as const,
                label: "Čas úklidu",
                value: `${block.setupAndTearDownRules.tearDownTime} min`,
              },
            ]
          : []),
      ]
    : [];

  const personnelItems = [
    ...(block.personnel?.length
      ? [
          {
            type: "tagList" as const,
            label: "Personál",
            items: block.personnel,
          },
        ]
      : []),
    ...(block.necessities?.length
      ? [
          {
            type: "tagList" as const,
            label: "Technické požadavky",
            items: block.necessities,
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
        title="Kapacita"
        icon={"Users"}
        iconBg="bg-listing-surface"
        iconColor="text-listing"
      >
        <InfoSection items={capacityItems} />
      </DashboardSection>

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
