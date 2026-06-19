import { DashboardSection } from "@/app/[locale]/(user)/components/dashboard-section";
import InfoSection from "@/app/[locale]/(user)/components/info-section";
import { Variant } from "@roo/common";

type EntertainmentBlock = Extract<
  Variant["details"][number],
  { blockType: "entertainment" }
>;

const AUDIENCE_LABELS: Record<string, string> = {
  adults: "Dospělí",
  kids: "Děti",
  seniors: "Senioři",
};

export function VariantEntertainmentDetails({
  block,
}: {
  block: EntertainmentBlock;
}) {
  const items = [
    ...(block.performance.entertainmentIsPerformance != null
      ? [
          {
            type: "boolean" as const,
            label: "Jde o vystoupení",
            value: block.performance.entertainmentIsPerformance,
          },
        ]
      : []),
    ...(block.performance.numberOfSets != null
      ? [
          {
            type: "text" as const,
            label: "Počet setů",
            value: `${block.performance.numberOfSets}`,
          },
        ]
      : []),
    ...(block.performance.pauseBetweenSetsInMinutes != null
      ? [
          {
            type: "text" as const,
            label: "Pauza mezi sety",
            value: `${block.performance.pauseBetweenSetsInMinutes} min`,
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

  return (
    <DashboardSection
      title="Zábavní program"
      icon={"Music"}
      iconBg="bg-purple-50"
      iconColor="text-purple-500"
    >
      <InfoSection items={items} />
    </DashboardSection>
  );
}
