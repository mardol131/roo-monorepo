import { DashboardSection } from "@/app/[locale]/(user)/components/dashboard-section";
import InfoSection from "@/app/[locale]/(user)/components/info-section";
import { Variant } from "@roo/common";

type GastroBlock = Extract<Variant["details"][number], { blockType: "gastro" }>;

export function VariantGastroDetails({ block }: { block: GastroBlock }) {
  const infoItems = [
    ...(block.minimumOrderAmount != null
      ? [
          {
            type: "text" as const,
            label: "Minimální objednávka",
            value: `${block.minimumOrderAmount} Kč`,
          },
        ]
      : []),
    ...(block.kidsMenu != null
      ? [{ type: "boolean" as const, label: "Dětské menu", value: block.kidsMenu }]
      : []),
    ...(block.alcoholIncluded != null
      ? [
          {
            type: "boolean" as const,
            label: "Alkohol v ceně",
            value: block.alcoholIncluded,
          },
        ]
      : []),
  ];

  if (infoItems.length === 0) return null;

  return (
    <DashboardSection
      title="Gastronomie"
      icon="Utensils"
      iconBg="bg-orange-50"
      iconColor="text-orange-500"
    >
      <InfoSection items={infoItems} />
    </DashboardSection>
  );
}
