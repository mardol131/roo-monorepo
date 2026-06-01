"use client";

import { DashboardSection } from "../../../../../../../../components/dashboard-section";
import InfoSection from "@/app/[locale]/(user)/components/info-section";
import { Space, Variant } from "@roo/common";

type VenueBlock = Extract<Variant["details"][number], { blockType: "venue" }>;

export function VariantVenueDetails({
  block,
  spaces,
}: {
  block: VenueBlock;
  spaces?: Space[];
}) {
  const formattedSpaces = block.includedSpaces?.flatMap((s) => {
    const name =
      typeof s !== "string" ? s.name : spaces?.find((sp) => sp.id === s)?.name;
    return name ? [{ name }] : [];
  });

  const items = [
    ...(block.includedSpaces?.length
      ? [
          {
            type: "tagList" as const,
            label: "Zahrnuté prostory",
            items: formattedSpaces,
          },
        ]
      : []),
    {
      type: "boolean" as const,
      label: "Ubytování",
      value: !!block.accommodation?.included,
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
      label: "Snídaně",
      value: !!block.breakfast?.included,
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

  console.log(items);

  if (items.length === 0) return null;

  return (
    <DashboardSection
      title="Prostory a vybavení"
      icon={"Package"}
      iconBg="bg-variant-surface"
      iconColor="text-variant"
    >
      <InfoSection items={items} />
    </DashboardSection>
  );
}
