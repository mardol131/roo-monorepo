import { DashboardSection } from "@/app/[locale]/(user)/components/dashboard-section";
import InfoSection from "@/app/[locale]/(user)/components/info-section";
import { Variant } from "@roo/common";
import { Music } from "lucide-react";

type EntertainmentBlock = Extract<
  Variant["details"][number],
  { blockType: "entertainment" }
>;

const AUDIENCE_LABELS: Record<string, string> = {
  adults: "Dospělí",
  kids: "Děti",
  seniors: "Senioři",
};

function capacityStr(c: { min?: number | null; max: number }) {
  return c.min ? `${c.min}–${c.max} osob` : `max. ${c.max} osob`;
}

export function EntertainmentDetails({ block }: { block: EntertainmentBlock }) {
  const items = [
    { type: "text" as const, label: "Kapacita", value: capacityStr(block.capacity) },
    ...(block.performanceDuration != null ? [{ type: "text" as const, label: "Délka vystoupení", value: `${block.performanceDuration} min` }] : []),
    ...(block.numberOfSets != null ? [{ type: "text" as const, label: "Počet setů", value: `${block.numberOfSets}` }] : []),
    ...(block.breakDuration != null ? [{ type: "text" as const, label: "Délka přestávky mezi sety", value: `${block.breakDuration} min` }] : []),
    ...(block.audience?.length
      ? [{ type: "tagList" as const, label: "Cílové publikum", items: block.audience.map((a) => AUDIENCE_LABELS[a] ?? a) }]
      : []),
    ...(block.personnel?.length ? [{ type: "tagList" as const, label: "Personál", items: block.personnel }] : []),
    ...(block.necessities?.length ? [{ type: "tagList" as const, label: "Technické požadavky", items: block.necessities }] : []),
    ...(block.setupAndTeardown
      ? [
          { type: "boolean" as const, label: "Příprava a úklid v ceně", value: block.setupAndTeardown.included },
          ...(block.setupAndTeardown.setupTime != null ? [{ type: "text" as const, label: "Čas přípravy", value: `${block.setupAndTeardown.setupTime} min` }] : []),
          ...(block.setupAndTeardown.teardownTime != null ? [{ type: "text" as const, label: "Čas úklidu", value: `${block.setupAndTeardown.teardownTime} min` }] : []),
        ]
      : []),
  ];

  return (
    <DashboardSection title="Zábavní program" icon={Music} iconBg="bg-purple-50" iconColor="text-purple-500">
      <InfoSection items={items} />
    </DashboardSection>
  );
}
