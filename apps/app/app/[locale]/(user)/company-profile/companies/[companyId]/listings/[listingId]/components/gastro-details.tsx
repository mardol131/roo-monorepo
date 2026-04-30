import { DashboardSection } from "@/app/[locale]/(user)/components/dashboard-section";
import InfoSection from "@/app/[locale]/(user)/components/info-section";
import { Listing } from "@roo/common";
import { MapPin, Users, Utensils } from "lucide-react";

type GastroBlock = Extract<Listing["details"][number], { blockType: "gastro" }>;

export function GastroDetails({ block }: { block: GastroBlock }) {
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

  const offerItems = [
    ...(block.cuisines?.length
      ? [{ type: "tagList" as const, label: "Kuchyně", items: block.cuisines }]
      : []),
    ...(block.dishTypes?.length
      ? [
          {
            type: "tagList" as const,
            label: "Typy pokrmů",
            items: block.dishTypes,
          },
        ]
      : []),
    ...(block.dietaryOptions?.length
      ? [
          {
            type: "tagList" as const,
            label: "Dietní možnosti",
            items: block.dietaryOptions,
          },
        ]
      : []),
    ...(block.foodServiceStyles?.length
      ? [
          {
            type: "tagList" as const,
            label: "Styl servisu",
            items: block.foodServiceStyles,
          },
        ]
      : []),
    {
      type: "boolean" as const,
      label: "Alkoholová licence",
      value: block.hasAlcoholLicense,
    },
    { type: "boolean" as const, label: "Dětské menu", value: block.kidsMenu },
  ];

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
