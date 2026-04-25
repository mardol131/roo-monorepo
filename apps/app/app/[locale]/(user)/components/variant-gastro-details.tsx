import { DashboardSection } from "@/app/[locale]/(user)/components/dashboard-section";
import InfoSection from "@/app/[locale]/(user)/components/info-section";
import { Variant } from "@roo/common";
import { Utensils } from "lucide-react";

type GastroBlock = Extract<Variant["details"][number], { blockType: "gastro" }>;

function capacityStr(c: { min?: number | null; max: number }) {
  return c.min ? `${c.min}–${c.max} osob` : `max. ${c.max} osob`;
}

export function VariantGastroDetails({ block }: { block: GastroBlock }) {
  const items = [
    {
      type: "text" as const,
      label: "Kapacita",
      value: capacityStr(block.capacity),
    },
    ...(block.pricePerPerson != null
      ? [
          {
            type: "text" as const,
            label: "Cena na osobu",
            value: `${block.pricePerPerson} Kč`,
          },
        ]
      : []),
    ...(block.minimumOrderCount != null
      ? [
          {
            type: "text" as const,
            label: "Minimální počet osob",
            value: `${block.minimumOrderCount}`,
          },
        ]
      : []),
    ...(block.cuisines?.length
      ? [{ type: "tagList" as const, label: "Kuchyně", items: block.cuisines }]
      : []),
    ...(block.dishTypes?.length
      ? [
          {
            type: "tagList" as const,
            label: "Typy jídel",
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
    ...(block.foodServiceStyle?.length
      ? [
          {
            type: "tagList" as const,
            label: "Způsob podávání",
            items: block.foodServiceStyle,
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
    ...(block.necessities?.length
      ? [
          {
            type: "tagList" as const,
            label: "Technické požadavky",
            items: block.necessities,
          },
        ]
      : []),
    { type: "boolean" as const, label: "Dětské menu", value: block.kidsMenu },
    {
      type: "boolean" as const,
      label: "Alkohol v ceně",
      value: block.alcoholIncluded,
    },
  ];

  return (
    <DashboardSection
      title="Gastronomie"
      icon={Utensils}
      iconBg="bg-orange-50"
      iconColor="text-orange-500"
    >
      <InfoSection items={items} />
    </DashboardSection>
  );
}
