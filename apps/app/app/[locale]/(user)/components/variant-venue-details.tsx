import { DashboardSection } from "./dashboard-section";
import InfoSection from "@/app/[locale]/(user)/components/info-section";
import { Variant } from "@roo/common";
import { Package } from "lucide-react";

type VenueBlock = Extract<Variant["details"][number], { blockType: "venue" }>;

function capacityStr(c: { min?: number | null; max: number }) {
  return c.min ? `${c.min}–${c.max} osob` : `max. ${c.max} osob`;
}

export function VariantVenueDetails({ block }: { block: VenueBlock }) {
  const items = [
    {
      type: "text" as const,
      label: "Kapacita",
      value: capacityStr(block.capacity),
    },
    ...(block.includedSpaces?.length
      ? [
          {
            type: "tagList" as const,
            label: "Zahrnuté prostory",
            items: block.includedSpaces,
          },
        ]
      : []),
    ...(block.activities?.length
      ? [
          {
            type: "tagList" as const,
            label: "Aktivity",
            items: block.activities,
          },
        ]
      : []),
    ...(block.personnel?.length
      ? [
          {
            type: "tagList" as const,
            label: "Personál",
            items: block.personnel,
          },
        ]
      : []),
    ...(block.services?.length
      ? [{ type: "tagList" as const, label: "Služby", items: block.services }]
      : []),
    ...(block.amenities?.length
      ? [
          {
            type: "tagList" as const,
            label: "Vybavení",
            items: block.amenities,
          },
        ]
      : []),
    ...(block.technology?.length
      ? [
          {
            type: "tagList" as const,
            label: "Technika",
            items: block.technology,
          },
        ]
      : []),
    {
      type: "boolean" as const,
      label: "Rezervace celého prostoru",
      value: block.canBeBookedAsWhole,
    },
    {
      type: "boolean" as const,
      label: "Ubytování",
      value: block.accommodation?.included,
    },
    ...(block.accommodation?.included && block.accommodation.capacity
      ? [
          {
            type: "text" as const,
            label: "Kapacita ubytování",
            value: `${block.accommodation.capacity} lůžek`,
          },
        ]
      : []),
    {
      type: "boolean" as const,
      label: "Parkování",
      value: block.parking?.included,
    },
    ...(block.parking?.included && block.parking.spots
      ? [
          {
            type: "text" as const,
            label: "Kapacita parkování",
            value: `${block.parking.spots} míst`,
          },
        ]
      : []),
    {
      type: "boolean" as const,
      label: "Snídaně",
      value: block.breakfast?.included,
    },
    ...(block.breakfast?.included && block.breakfast.price
      ? [
          {
            type: "text" as const,
            label: "Cena snídaně",
            value: block.breakfast.loweredPrice
              ? `${block.breakfast.loweredPrice} Kč (běžně ${block.breakfast.price} Kč)`
              : `${block.breakfast.price} Kč`,
          },
        ]
      : []),
  ];

  return (
    <DashboardSection
      title="Prostory a vybavení"
      icon={Package}
      iconBg="bg-variant-surface"
      iconColor="text-variant"
    >
      <InfoSection items={items} />
    </DashboardSection>
  );
}
